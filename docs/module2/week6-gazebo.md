---
sidebar_position: 1
title: "Robot Simulation with Gazebo"
description: "Physics simulation, URDF/SDF formats, and building digital twins for humanoid robots"
keywords: [gazebo, simulation, urdf, sdf, physics, digital-twin]
---

# Week 6: Robot Simulation with Gazebo

## Learning Outcomes

By the end of this chapter, you should be able to:
- Set up and configure the Gazebo simulation environment
- Understand URDF and SDF robot description formats
- Simulate physics, gravity, and collisions accurately
- Create custom simulation worlds for humanoid testing
- Bridge Gazebo with ROS 2 for robot control

## The Physics (Why)

Before deploying a humanoid robot in the real world, you need a safe environment to test algorithms. Real robots are expensive ($10k-$100k+), can be damaged by falls, and pose safety risks during development.

**Digital twins** solve this by creating virtual replicas of physical robots. In simulation, you can:
- Test walking algorithms without risking hardware damage
- Simulate dangerous scenarios (falling, collisions) safely
- Iterate rapidly on control algorithms
- Generate unlimited training data for AI models

Gazebo provides accurate physics simulation including gravity, friction, collision detection, and sensor modeling—essential for developing robust robotic systems.

## The Analogy (Mental Model)

Think of **Gazebo as a physics laboratory** where you can experiment with robots under controlled conditions. Just as aerospace engineers use wind tunnels to test aircraft before flight, roboticists use Gazebo to test robots before real-world deployment.

| Environment | Purpose | Fidelity | Speed |
|-------------|---------|----------|-------|
| **Gazebo** | Physics accuracy | High | Medium |
| **Unity** | Visual fidelity | Very High | Fast |
| **Real World** | Ground truth | Perfect | Real-time |

## The Visualization (Simulation Architecture)

```mermaid
graph TB
    subgraph "Gazebo Simulation"
        A[World SDF] --> B[Physics Engine]
        C[Robot URDF/SDF] --> B
        B --> D[Collision Detection]
        B --> E[Dynamics Solver]
        D --> F[Contact Forces]
        E --> G[Joint States]
    end
    
    subgraph "ROS 2 Bridge"
        F --> H[/contact_sensor]
        G --> I[/joint_states]
        J[/cmd_vel] --> B
    end
    
    subgraph "Control Nodes"
        I --> K[State Estimator]
        K --> L[Controller]
        L --> J
    end
```

## The Code (Implementation)

### Installation (Ubuntu 22.04)

```bash
# Install Gazebo Harmonic (recommended for ROS 2 Humble)
sudo apt-get update
sudo apt-get install ros-humble-ros-gz

# Verify installation
gz sim --version

# Launch an empty world
gz sim empty.sdf
```

### URDF Robot Description

```xml
<?xml version="1.0"?>
<!-- humanoid_leg.urdf - Simple humanoid leg for simulation -->
<robot name="humanoid_leg">
  
  <!-- Base link (hip) -->
  <link name="hip_link">
    <visual>
      <geometry>
        <box size="0.1 0.1 0.05"/>
      </geometry>
      <material name="gray">
        <color rgba="0.5 0.5 0.5 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.1 0.1 0.05"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="2.0"/>
      <inertia ixx="0.01" ixy="0" ixz="0" 
               iyy="0.01" iyz="0" izz="0.01"/>
    </inertial>
  </link>
  
  <!-- Thigh link -->
  <link name="thigh_link">
    <visual>
      <origin xyz="0 0 -0.2"/>
      <geometry>
        <cylinder radius="0.04" length="0.4"/>
      </geometry>
    </visual>
    <collision>
      <origin xyz="0 0 -0.2"/>
      <geometry>
        <cylinder radius="0.04" length="0.4"/>
      </geometry>
    </collision>
    <inertial>
      <origin xyz="0 0 -0.2"/>
      <mass value="3.0"/>
      <inertia ixx="0.05" ixy="0" ixz="0" 
               iyy="0.05" iyz="0" izz="0.01"/>
    </inertial>
  </link>
  
  <!-- Hip joint -->
  <joint name="hip_pitch" type="revolute">
    <parent link="hip_link"/>
    <child link="thigh_link"/>
    <origin xyz="0 0 -0.025"/>
    <axis xyz="0 1 0"/>
    <limit lower="-1.57" upper="1.57" effort="100" velocity="5"/>
    <dynamics damping="0.1" friction="0.05"/>
  </joint>
  
  <!-- Shin link -->
  <link name="shin_link">
    <visual>
      <origin xyz="0 0 -0.2"/>
      <geometry>
        <cylinder radius="0.03" length="0.4"/>
      </geometry>
    </visual>
    <collision>
      <origin xyz="0 0 -0.2"/>
      <geometry>
        <cylinder radius="0.03" length="0.4"/>
      </geometry>
    </collision>
    <inertial>
      <origin xyz="0 0 -0.2"/>
      <mass value="2.0"/>
      <inertia ixx="0.03" ixy="0" ixz="0" 
               iyy="0.03" iyz="0" izz="0.005"/>
    </inertial>
  </link>
  
  <!-- Knee joint -->
  <joint name="knee_pitch" type="revolute">
    <parent link="thigh_link"/>
    <child link="shin_link"/>
    <origin xyz="0 0 -0.4"/>
    <axis xyz="0 1 0"/>
    <limit lower="0" upper="2.5" effort="80" velocity="5"/>
    <dynamics damping="0.1" friction="0.05"/>
  </joint>

</robot>
```

### SDF World File

```xml
<?xml version="1.0"?>
<!-- humanoid_world.sdf - Test environment for humanoid robots -->
<sdf version="1.8">
  <world name="humanoid_test">
    
    <!-- Physics configuration -->
    <physics type="ode">
      <max_step_size>0.001</max_step_size>
      <real_time_factor>1.0</real_time_factor>
      <real_time_update_rate>1000</real_time_update_rate>
      <ode>
        <solver>
          <type>quick</type>
          <iters>50</iters>
        </solver>
      </ode>
    </physics>
    
    <!-- Lighting -->
    <light type="directional" name="sun">
      <cast_shadows>true</cast_shadows>
      <pose>0 0 10 0 0 0</pose>
      <diffuse>0.8 0.8 0.8 1</diffuse>
    </light>
    
    <!-- Ground plane -->
    <model name="ground">
      <static>true</static>
      <link name="ground_link">
        <collision name="collision">
          <geometry>
            <plane>
              <normal>0 0 1</normal>
              <size>100 100</size>
            </plane>
          </geometry>
          <surface>
            <friction>
              <ode>
                <mu>0.8</mu>
                <mu2>0.8</mu2>
              </ode>
            </friction>
          </surface>
        </collision>
        <visual name="visual">
          <geometry>
            <plane>
              <normal>0 0 1</normal>
              <size>100 100</size>
            </plane>
          </geometry>
        </visual>
      </link>
    </model>
    
    <!-- Obstacles for testing -->
    <model name="obstacle_box">
      <pose>2 0 0.25 0 0 0</pose>
      <static>true</static>
      <link name="link">
        <collision name="collision">
          <geometry>
            <box><size>0.5 0.5 0.5</size></box>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <box><size>0.5 0.5 0.5</size></box>
          </geometry>
          <material>
            <ambient>1 0 0 1</ambient>
          </material>
        </visual>
      </link>
    </model>
    
  </world>
</sdf>
```

### ROS 2 Gazebo Bridge

```python
#!/usr/bin/env python3
"""
gazebo_bridge.py - Bridge between Gazebo and ROS 2.
"""

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import JointState
from std_msgs.msg import Float64MultiArray


class GazeboBridge(Node):
    """Bridges Gazebo simulation with ROS 2 control."""
    
    def __init__(self):
        super().__init__('gazebo_bridge')
        
        # Subscribe to joint states from Gazebo
        self.joint_sub = self.create_subscription(
            JointState,
            '/joint_states',
            self.joint_callback,
            10
        )
        
        # Publish joint commands to Gazebo
        self.cmd_pub = self.create_publisher(
            Float64MultiArray,
            '/joint_commands',
            10
        )
        
        self.get_logger().info('Gazebo bridge started')
    
    def joint_callback(self, msg: JointState):
        """Process joint states from simulation."""
        for name, pos, vel in zip(msg.name, msg.position, msg.velocity):
            self.get_logger().debug(f'{name}: pos={pos:.3f}, vel={vel:.3f}')


def main(args=None):
    rclpy.init(args=args)
    node = GazeboBridge()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

## The Hardware Reality (Warning)

:::danger The Reality Gap
Simulation is never perfect. Common issues when moving from Gazebo to real robots:
- **Friction**: Simulated friction rarely matches real surfaces
- **Motor dynamics**: Real motors have delays and nonlinearities
- **Sensor noise**: Real sensors are noisier than simulated ones
- **Contact modeling**: Soft contacts are hard to simulate accurately
:::

:::warning Performance Requirements
Gazebo with complex humanoid models requires significant compute:
- **CPU**: Physics runs on CPU, needs fast single-thread performance
- **GPU**: Only needed for camera/LiDAR rendering
- **RAM**: 16GB minimum, 32GB recommended for complex scenes
:::

### URDF vs SDF Comparison

| Feature | URDF | SDF |
|---------|------|-----|
| **Purpose** | Robot description | World + Robot |
| **Physics** | Basic | Advanced |
| **Sensors** | Limited | Comprehensive |
| **Plugins** | ROS-specific | Gazebo-native |
| **Use Case** | ROS robot models | Full simulations |

## Assessment

### Recall

1. What is the difference between URDF and SDF formats?
2. What physics parameters affect simulation stability?
3. How do you bridge Gazebo with ROS 2?
4. What is the "reality gap" in robotics simulation?

### Apply

1. Create a URDF model for a simple 2-DOF robot arm with proper inertial properties.
2. Build a Gazebo world with stairs for testing humanoid climbing.
3. Write a ROS 2 node that reads joint states from Gazebo and publishes them at 100 Hz.

### Analyze

1. Why might a walking algorithm that works in Gazebo fail on a real robot?
2. Compare the trade-offs between simulation accuracy and speed.
3. Design a testing strategy that uses simulation to reduce real-world testing time by 90%.
