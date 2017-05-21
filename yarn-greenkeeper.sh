#!/bin/bash

echo "Should yarn.lock be regenerated?"
if [[ $TRAVIS_PULL_REQUEST_BRANCH != *"greenkeeper"* ]]; then
	# Not a GreenKeeper Pull Request, aborting
	exit 0
fi

echo "Cloning repo"
git clone "https://"$GITHUB_TOKEN"@github.com/"$TRAVIS_REPO_SLUG".git" repo
cd repo

echo "Switching to branch $TRAVIS_PULL_REQUEST_BRANCH"
git checkout $TRAVIS_PULL_REQUEST_BRANCH

# See if commit message includes "update"
git log --name-status HEAD^..HEAD | grep "update" || exit 0

echo "(Creat/updat)ing lockfile"
yarn

echo "Commit and push yarn.lock"
git config --global user.email "christian.kotzbauer@gmail.com"
git config --global user.name "Christian Kotzbauer"
git config --global push.default simple

git add yarn.lock
git commit -m "$(git log -1 --pretty=%B)"
git push
