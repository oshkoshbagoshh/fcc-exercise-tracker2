#!/bin/bash

# Base URL of your API
BASE_URL="http://localhost:3000"

# Function to get user logs
get_user_logs() {
    local user_id=$1
    local params=$2
    local response=$(curl -s "$BASE_URL/api/users/$user_id/logs$params")
    echo "$response" | jq '.'
}

# Array of user IDs (replace these with the actual IDs from your database)
user_ids=("66aa96a0f1af15a990919ec0" "66aa9897f1af15a990919edb" "66aa9897f1af15a990919edd")

# Get logs for each user
for user_id in "${user_ids[@]}"
do
    echo "Logs for User ID: $user_id"
    echo "---------------------"

    # Get all logs
    echo "All logs:"
    get_user_logs $user_id ""
    echo

    # Get logs with date range
    echo "Logs from 2023-07-01 to 2023-07-15:"
    get_user_logs $user_id "?from=2023-07-01&to=2023-07-15"
    echo

    # Get logs with limit
    echo "First 3 logs:"
    get_user_logs $user_id "?limit=3"
    echo

    # Get logs with date range and limit
    echo "First 2 logs from 2023-07-01 to 2023-07-31:"
    get_user_logs $user_id "?from=2023-07-01&to=2023-07-31&limit=2"
    echo

    echo "============================================="
    echo
done

echo "Log retrieval complete!"
