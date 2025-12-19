-- Add background fields to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS software_background VARCHAR(20) CHECK (software_background IN ('Beginner', 'Intermediate', 'Advanced')),
ADD COLUMN IF NOT EXISTS hardware_background VARCHAR(20) CHECK (hardware_background IN ('None', 'Arduino', 'RaspberryPi')),
ADD COLUMN IF NOT EXISTS learning_goal TEXT;