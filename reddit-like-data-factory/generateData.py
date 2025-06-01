import json
import random
import datetime
import os

def generate_reddit_data(num_interactions=6000, num_users=500, num_subreddits=50):
    """Generates a larger Reddit-like dataset."""

    users = []
    for i in range(num_users):
        user_id = f"u{i+1}"
        users.append({
            "userId": user_id,
            "username": f"user_{i+1}",
            "joinDate": str(datetime.datetime.now() - datetime.timedelta(days=random.randint(1, 365))),
            "karma": random.randint(0, 1000),
            "profilePicture": f"https://i.pravatar.cc/150?u={user_id}"
        })

    subreddits = []
    for i in range(num_subreddits):
        subreddit_id = f"s{i+1}"
        subreddits.append({
            "subredditId": subreddit_id,
            "subredditName": f"subreddit_{i+1}"
        })

    interactions = []
    subreddit_interactions = []
    
    # First generate some base interactions (threads and comments)
    for i in range(num_interactions // 2):  # Generate half as base interactions
        interaction_type = random.choice(["thread", "comment"])
        user_id = random.choice(users)["userId"]
        timestamp = str(datetime.datetime.now() - datetime.timedelta(minutes=random.randint(1, 1440 * 30)))

        if interaction_type == "thread":
            thread_id = f"t{i+1}"
            interactions.append({
                "type": "thread",
                "threadId": thread_id,
                "title": f"Thread {i+1}",
                "authorId": user_id,
                "subredditId": random.choice(subreddits)["subredditId"],
                "timestamp": timestamp,
                "content": f"Content of thread {i+1}"
            })
        elif interaction_type == "comment":
            thread_id = random.choice([interaction["threadId"] for interaction in interactions if interaction["type"] == "thread"] or ["t1"])
            comment_id = f"c{i+1}"
            interactions.append({
                "type": "comment",
                "commentId": comment_id,
                "authorId": user_id,
                "timestamp": timestamp,
                "content": f"Comment {i+1} on thread {thread_id}",
                "threadId": thread_id
            })

    # Now generate likes, dislikes, and subreddit interactions
    for i in range(num_interactions // 2, num_interactions):
        interaction_type = random.choice(["like", "dislike", "subreddit"])
        user_id = random.choice(users)["userId"]
        timestamp = str(datetime.datetime.now() - datetime.timedelta(minutes=random.randint(1, 1440 * 30)))

        if interaction_type == "like":
            target_interaction = random.choice([inter for inter in interactions if inter["type"] in ["thread", "comment"]])
            target_type = target_interaction["type"]
            target_id = target_interaction["threadId"] if target_type == "thread" else target_interaction["commentId"]
            interactions.append({
                "type": "like",
                "userId": user_id,
                "targetId": target_id,
                "targetType": target_type,
                "timestamp": timestamp
            })
        elif interaction_type == "dislike":
            target_interaction = random.choice([inter for inter in interactions if inter["type"] in ["thread", "comment"]])
            target_type = target_interaction["type"]
            target_id = target_interaction["threadId"] if target_type == "thread" else target_interaction["commentId"]
            interactions.append({
                "type": "dislike",
                "userId": user_id,
                "targetId": target_id,
                "targetType": target_type,
                "timestamp": timestamp
            })
        elif interaction_type == "subreddit":
            subreddit_interactions.append(random.choice(subreddits))

    # Combine all interactions
    all_interactions = interactions + subreddit_interactions

    return {"users": users, "interactions": all_interactions}

data = generate_reddit_data()

# Save the data to a file
output_file = "reddit_data.json"
with open(output_file, 'w') as f:
    json.dump(data, f, indent=2)

# Print a small sample of the generated data
print(json.dumps(data["interactions"][0:10], indent=2))
print(f"\nTotal interactions: {len(data['interactions'])}")
print(f"Total users: {len(data['users'])}")
print(f"\nData has been saved to: {os.path.abspath(output_file)}")

# Print the first user and interaction as examples
print("\nExample user:")
print(json.dumps(data["users"][0], indent=2))
print("\nExample interaction:")
print(json.dumps(data["interactions"][0], indent=2))