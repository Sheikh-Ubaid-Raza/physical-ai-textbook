---
sidebar_position: 0
title: "Hardware Requirements"
description: "Complete hardware guide for Physical AI & Humanoid Robotics development"
keywords: [hardware, gpu, jetson, requirements, workstation, robot]
---

# Hardware Requirements Guide

This guide outlines the hardware needed for the Physical AI & Humanoid Robotics curriculum. We provide three tiers to accommodate different budgets and learning goals.

## Learning Outcomes

By reviewing this guide, you will be able to:
- Select appropriate hardware for your learning goals
- Understand the trade-offs between local and cloud development
- Plan a budget for Physical AI development
- Identify essential vs. optional components

## Hardware Tiers Overview

| Tier | Purpose | Budget | Best For |
|------|---------|--------|----------|
| **Tier 1: Cloud** | Remote development | $50-200/month | Students, beginners |
| **Tier 2: Workstation** | Local development | $3,000-5,000 | Serious learners |
| **Tier 3: Full Lab** | Complete development | $20,000+ | Research, production |

## Tier 1: Cloud Development

For learners without access to high-end hardware, cloud computing provides a cost-effective alternative.

### Recommended Cloud Services

| Service | Instance Type | GPU | Cost/Hour | Monthly (40hr/week) |
|---------|---------------|-----|-----------|---------------------|
| **AWS** | g5.2xlarge | A10G (24GB) | $1.21 | ~$194 |
| **Azure** | NC6s_v3 | V100 (16GB) | $0.90 | ~$144 |
| **Google Cloud** | n1-standard-4 + T4 | T4 (16GB) | $0.35 | ~$56 |
| **Lambda Labs** | gpu_1x_a10 | A10 (24GB) | $0.60 | ~$96 |

:::tip Cost Optimization
- Use spot/preemptible instances for 60-80% savings
- Stop instances when not in use
- Use smaller instances for coding, larger for training
:::

### Cloud Setup for Isaac Sim

```bash
# AWS g5.2xlarge setup
# 1. Launch Ubuntu 22.04 AMI with g5.2xlarge
# 2. Install NVIDIA drivers
sudo apt-get update
sudo apt-get install -y nvidia-driver-535

# 3. Install Omniverse and Isaac Sim
# Follow NVIDIA's cloud deployment guide
```

## Tier 2: Digital Twin Workstation

For serious development, a local workstation provides the best experience.

### Minimum Specifications

| Component | Minimum | Recommended | Notes |
|-----------|---------|-------------|-------|
| **GPU** | RTX 4070 Ti (12GB) | RTX 4090 (24GB) | Isaac Sim requires RTX |
| **CPU** | Intel i7-12700 / Ryzen 7 5800X | Intel i9-13900K / Ryzen 9 7950X | Physics runs on CPU |
| **RAM** | 32GB DDR4 | 64GB DDR5 | Complex scenes need more |
| **Storage** | 500GB NVMe SSD | 2TB NVMe SSD | Isaac Sim is ~30GB |
| **OS** | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS | Windows not recommended |

### Recommended Build (~$3,500)

| Component | Model | Price |
|-----------|-------|-------|
| GPU | NVIDIA RTX 4070 Ti Super 16GB | $800 |
| CPU | AMD Ryzen 9 7900X | $400 |
| Motherboard | ASUS ROG Strix X670E-F | $350 |
| RAM | 64GB DDR5-5600 (2x32GB) | $180 |
| Storage | Samsung 990 Pro 2TB NVMe | $180 |
| PSU | Corsair RM850x | $140 |
| Case | Fractal Design Meshify 2 | $150 |
| Cooling | Noctua NH-D15 | $100 |
| **Total** | | **~$2,300** |

:::warning Power Requirements
RTX 4090 systems require 850W+ PSU. Ensure adequate cooling—sustained GPU loads generate significant heat.
:::

### Software Stack

```bash
# Ubuntu 22.04 setup
# 1. Install NVIDIA drivers
sudo apt-get update
sudo apt-get install -y nvidia-driver-535

# 2. Install CUDA Toolkit
wget https://developer.download.nvidia.com/compute/cuda/12.2.0/local_installers/cuda_12.2.0_535.54.03_linux.run
sudo sh cuda_12.2.0_535.54.03_linux.run

# 3. Install ROS 2 Humble
sudo apt install software-properties-common
sudo add-apt-repository universe
sudo apt update && sudo apt install curl -y
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
sudo apt update
sudo apt install ros-humble-desktop

# 4. Install Isaac Sim via Omniverse Launcher
# Download from https://www.nvidia.com/en-us/omniverse/
```

## Tier 3: Physical AI Edge Kit

For deploying to real robots, you need edge computing hardware.

### NVIDIA Jetson Options

| Model | GPU Cores | RAM | AI Performance | Price |
|-------|-----------|-----|----------------|-------|
| **Jetson Orin Nano** | 1024 | 8GB | 40 TOPS | $499 |
| **Jetson Orin NX 8GB** | 1024 | 8GB | 70 TOPS | $699 |
| **Jetson Orin NX 16GB** | 1024 | 16GB | 100 TOPS | $899 |
| **Jetson AGX Orin 32GB** | 2048 | 32GB | 200 TOPS | $1,599 |
| **Jetson AGX Orin 64GB** | 2048 | 64GB | 275 TOPS | $1,999 |

### Jetson Student Kit (~$700)

Complete edge development kit for students:

| Component | Model | Price |
|-----------|-------|-------|
| Compute | Jetson Orin Nano Developer Kit | $499 |
| Camera | Intel RealSense D435i | $350 |
| Storage | Samsung 256GB NVMe | $40 |
| Power | 65W USB-C Power Supply | $30 |
| Cables | USB-C, Ethernet, HDMI | $30 |
| Case | 3D Printed Enclosure | $20 |
| **Total** | | **~$970** |

:::tip Student Discounts
NVIDIA offers educational discounts on Jetson hardware. Check with your institution for academic pricing.
:::

### Sensor Options

| Sensor | Purpose | Price | Notes |
|--------|---------|-------|-------|
| **Intel RealSense D435i** | RGB-D + IMU | $350 | Best value for indoor |
| **Intel RealSense D455** | RGB-D + IMU | $450 | Longer range |
| **Stereolabs ZED 2i** | Stereo + IMU | $499 | Better outdoor |
| **Velodyne VLP-16** | 3D LiDAR | $4,000 | Outdoor navigation |
| **RPLidar A1** | 2D LiDAR | $100 | Budget indoor |

## Tier 4: Robot Lab (Optional)

For hands-on robot development:

### Humanoid Robot Options

| Robot | DOF | Height | Features | Price |
|-------|-----|--------|----------|-------|
| **Unitree G1** | 23 | 1.3m | Walking, manipulation | ~$16,000 |
| **Unitree H1** | 19 | 1.8m | Fast walking | ~$90,000 |
| **Agility Digit** | 16 | 1.6m | Industrial use | ~$250,000 |

### Alternative Platforms

For learning without full humanoids:

| Platform | Type | Price | Best For |
|----------|------|-------|----------|
| **Unitree Go2** | Quadruped | $1,600 | Locomotion basics |
| **Franka Emika** | Arm | $20,000 | Manipulation |
| **TurtleBot 4** | Mobile base | $1,200 | Navigation |
| **Open Manipulator X** | Arm | $500 | Budget manipulation |

## Cloud Cost Calculator

Estimate your monthly cloud costs:

| Activity | Hours/Week | Instance | Cost/Hour | Monthly |
|----------|------------|----------|-----------|---------|
| Coding/Testing | 20 | t3.medium | $0.04 | $3.20 |
| Simulation | 10 | g5.2xlarge | $1.21 | $48.40 |
| Training | 5 | g5.4xlarge | $2.42 | $48.40 |
| **Total** | 35 | | | **~$100** |

:::tip Spot Instances
Using spot instances can reduce costs by 60-80%:
- g5.2xlarge spot: ~$0.40/hr (vs $1.21 on-demand)
- Best for interruptible workloads like training
:::

## Recommended Learning Path

### Phase 1: Foundations (Weeks 1-5)
- **Hardware**: Cloud (g5.2xlarge) or laptop with GPU
- **Cost**: ~$50-100/month cloud or existing hardware

### Phase 2: Simulation (Weeks 6-10)
- **Hardware**: Workstation with RTX 4070 Ti+ or cloud
- **Cost**: ~$100-200/month cloud or one-time workstation

### Phase 3: Edge Deployment (Weeks 11-13)
- **Hardware**: Jetson Orin Nano + RealSense camera
- **Cost**: ~$850 one-time

### Phase 4: Robot Integration (Capstone)
- **Hardware**: Access to robot platform (lab, rental, or purchase)
- **Cost**: Varies widely

## Assessment

### Recall

1. What is the minimum GPU VRAM required for Isaac Sim?
2. What are the advantages of Jetson Orin over cloud deployment?
3. Why is Ubuntu recommended over Windows for robotics development?

### Apply

1. Design a hardware setup for a $2,000 budget that can run Isaac Sim.
2. Calculate the 6-month cost of cloud development vs. purchasing a workstation.
3. Select sensors for a humanoid robot that needs to navigate indoors and manipulate objects.

### Analyze

1. Compare the trade-offs between Jetson Orin Nano and Jetson AGX Orin for a mobile robot.
2. When would cloud development be more cost-effective than local hardware?
3. Design a phased hardware acquisition plan for a robotics lab with a $50,000 annual budget.
