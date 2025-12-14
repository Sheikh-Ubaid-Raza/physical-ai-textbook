---
sidebar_position: 2
title: "Unity Integration and Sensor Simulation"
description: "High-fidelity rendering with Unity and simulating LiDAR, depth cameras, and IMUs"
keywords: [unity, sensors, lidar, depth-camera, imu, simulation]
---

# Week 7: Unity Integration and Sensor Simulation

## Learning Outcomes

By the end of this chapter, you should be able to:
- Understand when to use Unity vs. Gazebo for robot simulation
- Configure LiDAR, depth camera, and IMU sensors in simulation
- Process simulated sensor data in ROS 2
- Create realistic sensor noise models

## The Physics (Why)

While Gazebo excels at physics simulation, **Unity** provides superior visual fidelity—essential for training computer vision models. Additionally, accurate **sensor simulation** is critical because robots perceive the world through sensors, not direct access to simulation state.

## The Analogy (Mental Model)

| Simulator | Strength | Best For |
|-----------|----------|----------|
| **Gazebo** | Physics accuracy | Control algorithms, dynamics |
| **Unity** | Visual realism | Vision AI, human interaction |
| **Isaac Sim** | Both + GPU | Production sim-to-real |

Think of it like movie production: Gazebo is the stunt coordinator (physics), Unity is the cinematographer (visuals).

## The Visualization (Sensor Pipeline)

```mermaid
graph LR
    subgraph "Physical World"
        A[Robot] --> B[Environment]
    end
    
    subgraph "Sensor Simulation"
        B --> C[LiDAR Plugin]
        B --> D[Camera Plugin]
        B --> E[IMU Plugin]
    end
    
    subgraph "ROS 2 Topics"
        C --> F[/scan]
        D --> G[/camera/image]
        D --> H[/camera/depth]
        E --> I[/imu]
    end
    
    subgraph "Perception Stack"
        F --> J[SLAM]
        G --> K[Object Detection]
        H --> J
        I --> L[State Estimation]
    end
```

## The Code (Implementation)

### LiDAR Sensor Configuration (SDF)

```xml
<!-- lidar_sensor.sdf - 2D LiDAR configuration -->
<sensor name="lidar" type="gpu_lidar">
  <pose>0 0 0.1 0 0 0</pose>
  <topic>/scan</topic>
  <update_rate>10</update_rate>
  <lidar>
    <scan>
      <horizontal>
        <samples>360</samples>
        <resolution>1</resolution>
        <min_angle>-3.14159</min_angle>
        <max_angle>3.14159</max_angle>
      </horizontal>
    </scan>
    <range>
      <min>0.1</min>
      <max>10.0</max>
      <resolution>0.01</resolution>
    </range>
    <noise>
      <type>gaussian</type>
      <mean>0.0</mean>
      <stddev>0.01</stddev>
    </noise>
  </lidar>
</sensor>
```

### Depth Camera Configuration

```xml
<!-- depth_camera.sdf - Intel RealSense D435i style -->
<sensor name="depth_camera" type="depth_camera">
  <pose>0.1 0 0.5 0 0 0</pose>
  <update_rate>30</update_rate>
  <camera>
    <horizontal_fov>1.047</horizontal_fov>
    <image>
      <width>640</width>
      <height>480</height>
      <format>R_FLOAT32</format>
    </image>
    <clip>
      <near>0.1</near>
      <far>10.0</far>
    </clip>
    <noise>
      <type>gaussian</type>
      <mean>0.0</mean>
      <stddev>0.005</stddev>
    </noise>
  </camera>
</sensor>
```

### IMU Configuration

```xml
<!-- imu_sensor.sdf - 6-axis IMU -->
<sensor name="imu" type="imu">
  <pose>0 0 0.3 0 0 0</pose>
  <update_rate>100</update_rate>
  <imu>
    <angular_velocity>
      <x><noise type="gaussian"><mean>0</mean><stddev>0.001</stddev></noise></x>
      <y><noise type="gaussian"><mean>0</mean><stddev>0.001</stddev></noise></y>
      <z><noise type="gaussian"><mean>0</mean><stddev>0.001</stddev></noise></z>
    </angular_velocity>
    <linear_acceleration>
      <x><noise type="gaussian"><mean>0</mean><stddev>0.01</stddev></noise></x>
      <y><noise type="gaussian"><mean>0</mean><stddev>0.01</stddev></noise></y>
      <z><noise type="gaussian"><mean>0</mean><stddev>0.01</stddev></noise></z>
    </linear_acceleration>
  </imu>
</sensor>
```

### Processing Sensor Data in ROS 2

```python
#!/usr/bin/env python3
"""
sensor_processor.py - Process simulated sensor data.
"""

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan, Image, Imu
from cv_bridge import CvBridge
import numpy as np


class SensorProcessor(Node):
    """Processes data from simulated sensors."""
    
    def __init__(self):
        super().__init__('sensor_processor')
        
        self.bridge = CvBridge()
        
        # LiDAR subscriber
        self.lidar_sub = self.create_subscription(
            LaserScan, '/scan', self.lidar_callback, 10
        )
        
        # Depth camera subscriber
        self.depth_sub = self.create_subscription(
            Image, '/camera/depth', self.depth_callback, 10
        )
        
        # IMU subscriber
        self.imu_sub = self.create_subscription(
            Imu, '/imu', self.imu_callback, 10
        )
        
        self.get_logger().info('Sensor processor started')
    
    def lidar_callback(self, msg: LaserScan):
        """Process LiDAR scan for obstacle detection."""
        ranges = np.array(msg.ranges)
        
        # Find minimum distance (closest obstacle)
        valid_ranges = ranges[np.isfinite(ranges)]
        if len(valid_ranges) > 0:
            min_dist = np.min(valid_ranges)
            min_idx = np.argmin(valid_ranges)
            angle = msg.angle_min + min_idx * msg.angle_increment
            
            if min_dist < 0.5:
                self.get_logger().warn(
                    f'Obstacle at {min_dist:.2f}m, angle {np.degrees(angle):.1f}°'
                )
    
    def depth_callback(self, msg: Image):
        """Process depth image for 3D perception."""
        depth_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='32FC1')
        
        # Calculate average depth in center region
        h, w = depth_image.shape
        center = depth_image[h//3:2*h//3, w//3:2*w//3]
        avg_depth = np.nanmean(center)
        
        self.get_logger().debug(f'Center depth: {avg_depth:.2f}m')
    
    def imu_callback(self, msg: Imu):
        """Process IMU for orientation estimation."""
        # Extract orientation (quaternion)
        q = msg.orientation
        
        # Extract angular velocity
        omega = msg.angular_velocity
        
        # Extract linear acceleration
        accel = msg.linear_acceleration
        
        # Simple tilt detection from accelerometer
        tilt_x = np.arctan2(accel.y, accel.z)
        tilt_y = np.arctan2(-accel.x, np.sqrt(accel.y**2 + accel.z**2))
        
        if abs(tilt_x) > 0.3 or abs(tilt_y) > 0.3:
            self.get_logger().warn(
                f'High tilt detected: roll={np.degrees(tilt_x):.1f}°, '
                f'pitch={np.degrees(tilt_y):.1f}°'
            )


def main(args=None):
    rclpy.init(args=args)
    node = SensorProcessor()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

## The Hardware Reality (Warning)

:::danger Sensor Noise is Critical
Simulated sensors without noise produce unrealistically clean data. Always add realistic noise models:
- **LiDAR**: Gaussian noise + occasional dropouts
- **Camera**: Motion blur, exposure variation
- **IMU**: Bias drift, temperature effects
:::

:::tip Unity for Vision AI
If training neural networks for object detection or segmentation, Unity's photorealistic rendering produces better training data than Gazebo's basic graphics.
:::

## Assessment

### Recall

1. What are the key differences between Gazebo and Unity for robotics?
2. What noise parameters should be configured for a simulated IMU?
3. How do you process depth images in ROS 2?

### Apply

1. Configure a 3D LiDAR sensor with 16 vertical beams and realistic noise.
2. Write a node that fuses LiDAR and depth camera data for obstacle detection.
3. Create a sensor noise model that varies based on distance (more noise at longer ranges).

### Analyze

1. Why might a vision algorithm trained on Unity data fail on real camera images?
2. Compare the computational cost of simulating LiDAR vs. depth cameras.
3. Design a sensor suite for a humanoid robot that must navigate outdoors.
