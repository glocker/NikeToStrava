
readonly bearer_token="eyJhbGciOiJSUzI1NiIsImtpZCI6IjMwZTQ0MjE1LThjZTAtNDdiZi04Y2Y1LWQwNGViOGM4ZTI1N3NpZyJ9.eyJpYXQiOjE2OTAzMDQwNTEsImV4cCI6MTY5MDMwNzY1MSwiaXNzIjoib2F1dGgyYWNjIiwianRpIjoiYjI4YWVmYzYtZjRhNi00MjA4LTgxMWQtYjJhNWZmMjQwZmMwIiwiYXVkIjoiY29tLm5pa2UuZGlnaXRhbCIsInNidCI6Im5pa2U6YXBwIiwidHJ1c3QiOjEwMCwibGF0IjoxNjkwMzA0MDQ4LCJzY3AiOlsibmlrZS5kaWdpdGFsIl0sInN1YiI6ImNvbS5uaWtlLmNvbW1lcmNlLm5pa2Vkb3Rjb20ud2ViIiwicHJuIjoiNTIyY2I2YjMtMjdiMi00MjkxLWIyYTItNDAxODdjODM2ZmJmIiwicHJ0IjoibmlrZTpwbHVzIiwibHJzY3AiOiJvcGVuaWQgbmlrZS5kaWdpdGFsIHByb2ZpbGUgZW1haWwgcGhvbmUgZmxvdyBjb3VudHJ5In0.1Rc0v6fFUgCxth7zdqrgen_IU7mrZ1vojwtkKtEoQ9fV5O0bklhcGv8RRtWr6Ps9uyZNegDwHZcgB964JpOkgPyBK9N6eBc37qHt_ctOML-tDltXXnEVqlleoAOpiSwshV5yC9exqMoEfdadXh3L2QSqaCb3LI1HTNUEpjVixdYddWsNPTJw8DB_PbvjfB17jD3B1bopIDfWXX-7YKP3LKKT3o5k1nRdZBSEqQfcZh2k1ct0efQPOLvr9iDPtg2avKtGi9pEJs-6iiGN1VkOF72eZXxwUYqc3hvywOzJnILofwcpBkEZIl5XpA6gBi9gbfMLM79ILJAyAhQY6YQD8g"
if [[ -z "$bearer_token" ]]; then
  echo "Usage: $0 bearer_token"
  exit
fi

if ! type jq >/dev/null 2>&1; then
  echo "Missing jq, please install it. e.g. brew install jq" >&2
  exit 1
fi

nike_plus_api() {
  curl -H "Authorization: Bearer ${bearer_token}" "$@"
}

activity_ids=()
activities_page=0
while true; do
  activities_file="activities-${activities_page}.json"

  if [[ -z "$after_id" ]]; then
    url="https://api.nike.com/sport/v3/me/activities/after_time/0"
  else
    url="https://api.nike.com/sport/v3/me/activities/after_id/${after_id}"
  fi

  echo "Fetch $url..."
  nike_plus_api "$url" > "$activities_file"

  activity_ids=("${activity_ids[@]}" $(jq -r ".activities[].id" "$activities_file"))

  after_id=$(jq -r ".paging.after_id" "$activities_file")
  if [[ "$after_id" == "null" ]]; then
    break
  else
    activities_page=$((activities_page + 1));
  fi
done

for activity_id in ${activity_ids[@]}; do
  activity_file="activity-${activity_id}.json"

  url="https://api.nike.com/sport/v3/me/activity/${activity_id}?metrics=ALL"

  echo "Fetch $url..."
  nike_plus_api "$url" > "$activity_file"
done