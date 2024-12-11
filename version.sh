# Replace v1.2.0 with the new version you want to add
NEW_VERSION="v1.1.0"

# Create a new tag
git tag -a "$NEW_VERSION" -m "update changelog.md"

# Get the date of the new version
VERSION_DATE=$(git log -1 --format=%ad --date=short "$NEW_VERSION")

# Check if the tag creation was successful
if git rev-parse "$NEW_VERSION" >/dev/null 2>&1; then
  # Generate the changelog for the new version
  {
    echo "## $NEW_VERSION ($VERSION_DATE)"
    git log "$NEW_VERSION"..HEAD --pretty=format:"- %h %s (%ad)" --date=short
    echo ""
  } | cat - CHANGELOG.md > TEMP_CHANGELOG.md && mv TEMP_CHANGELOG.md CHANGELOG.md
  # # Push the tag and changes to the remote repository
  # git push origin "$NEW_VERSION"  
else
  echo "Error: Failed to create tag $NEW_VERSION. Aborting."
fi
