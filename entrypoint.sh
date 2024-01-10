#!/bin/bash
set -e

# Run the main application script
npm run start &

# Run additional scripts in the background
npm run start-getJobs &
npm run start-createJobs &

# Keep the container running
wait
