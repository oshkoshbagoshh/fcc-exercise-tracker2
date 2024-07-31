#!/bin/bash

# URL of your API
API_URL="https://3000-oshkoshbago-fccexercise-wwq5q8sqngc.ws-us115.gitpod.io/api"



# Function to create a user
create_user() {
    local username=$1
    curl -X POST -H "Content-Type: application/json" -d "{\"username\":\"$username\"}" $API_URL/users
}

# Function to add an exercise
add_exercise() {
    local user_id=$1
    local description=$2
    local duration=$3
    local date=$4
    curl -X POST -H "Content-Type: application/json" \
         -d "{\"description\":\"$description\",\"duration\":$duration,\"date\":\"$date\"}" \
         $API_URL/users/$user_id/exercises
}

# Create users
user1=$(create_user "john_doe" | jq -r '._id')
user2=$(create_user "jane_smith" | jq -r '._id')

# Add exercises for user1
add_exercise $user1 "Running" 30 "2023-07-01"
add_exercise $user1 "Weightlifting" 45 "2023-07-03"

# Add exercises for user2
add_exercise $user2 "Yoga" 60 "2023-07-02"
add_exercise $user2 "Swimming" 40 "2023-07-04"

echo "Data seeding completed!"
