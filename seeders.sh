#!/bin/bash

# Base URL of your API
BASE_URL="http://localhost:3000"

# Function to create a user
create_user() {
    local username=$1
    local response=$(curl -s -X POST -H "Content-Type: application/json" -d "{\"username\":\"$username\"}" "$BASE_URL/api/users")
    echo $response
}

# Function to add an exercise
add_exercise() {
    local user_id=$1
    local description=$2
    local duration=$3
    local date=$4
    local response=$(curl -s -X POST -H "Content-Type: application/json" -d "{\"description\":\"$description\",\"duration\":$duration,\"date\":\"$date\"}" "$BASE_URL/api/users/$user_id/exercises")
    echo $response
}

# Create 3 users
echo "Creating users..."
user1=$(create_user "user1")
user2=$(create_user "user2")
user3=$(create_user "user3")

# Extract user IDs
user1_id=$(echo $user1 | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
user2_id=$(echo $user2 | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
user3_id=$(echo $user3 | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

echo "User 1 ID: $user1_id"
echo "User 2 ID: $user2_id"
echo "User 3 ID: $user3_id"

# Add exercises for each user
echo "Adding exercises..."
for user_id in $user1_id $user2_id $user3_id
do
    add_exercise $user_id "Running" 30 "2023-07-01"
    add_exercise $user_id "Cycling" 45 "2023-07-05"
    add_exercise $user_id "Swimming" 60 "2023-07-10"
    add_exercise $user_id "Weight Training" 40 "2023-07-15"
    add_exercise $user_id "Yoga" 50 "2023-07-20"
done

echo "Database population complete!"


