---
title: "Keeping log of Git"
description: ""
tags: [
  "git"
]
categories: [
  "git"
]
author: "thinkerou"
date: 2019-03-10
image: 'posts/candy-bomber-4166906_1280.jpg'
---

## What?

I recently migrated [the examples of Gin](https://github.com/gin-gonic/gin/tree/master/examples) to one separate repository named [gin-gonic/examples](https://github.com/gin-gonic/examples) and built another separate [website](https://gin-gonic.com/) repository for [Gin](https://github.com/gin-gonic/gin) web framework by migrating the [README.md](https://github.com/gin-gonic/gin/blob/master/README.md) of [Gin](https://github.com/gin-gonic/gin).

For keeping log of old Git to new repository, how to do it?

we need to slove two cases:

- migrated subdirectory
- migrated root file

## How?

First, we define the below information:

```
OLD-REPO: https://github.com/thinkerou/gin.git

MIGRATED-REPO-SUB-DIR-NAME: examples

NEW-REPO-SUB-DIR: https://github.com/gin-gonic/examples.git 

NEW-REPO-ROOT-FILE-NAME: website

NEW-REPO-ROOT-FILE: https://github.com/gin-gonic/website.git
```

Second, we use the following command to keeping log of Git:

- Cloning old repository and removing origin remote

```
git clone OLD-REPO NEW-REPO-SUB-DIR-NAME
cd NEW-REPO-SUB-DIR-NAME
git remote rm origin 
```

- (Important!) Filtrating the specially history of Git

```
git filter-branch --tag-name-filter cat --prune-empty --subdirectory-filter MIGRATED-REPO-SUB-DIR-NAME -- --all
```

- Cleaning the object of .git direcotry

```
git reset --hard
git for-each-ref --format="%(refname)" refs/original/ | xargs -n 1 git update-ref -d
git reflog expire --expire=now --all
git gc --aggressive --prune=now
```

- Pushing the local repository to origin

```
git remote add origin NEW-REPO-SUB-DIR
git push -u origin master
```

If the origin repository is empty, the above command is right. Otherwise, we need to use the below command again to push the local repository to `dev` branch.

```
git push origin master:dev
```

- Merging dev branch to master branch

```
git merge origin/dev --allow-unrelated-histories
git push origin master
```

But, I encounter one new trouble:

```
fatal: refusing to merge unrelated histories
Error redoing merge 1234deadbeef1234deadbeef
```

According to <<[Git refusing to merge unrelated histories on rebase](https://stackoverflow.com/questions/37937984/git-refusing-to-merge-unrelated-histories-on-rebase)>>, we solve the issue:

```
git pull origin master --allow-unrelated-histories
git push origin master
```

As was mentioned above, we can keep log of Git when migrate subdirectory. But migrate root file?

According to [the StackOverflow question](https://stackoverflow.com/questions/5998987/splitting-a-set-of-files-within-a-git-repo-into-their-own-repository-preserving), we can perfect solve it using the following command:

```
git filter-branch --prune-empty --index-filter 'git ls-tree -r --name-only --full-tree $GIT_COMMIT | grep -v "^README.md$" |grep -v "^git-changelog" | xargs git rm --cached -r' -- --all
```

We use `--index-filter` parameter not `--tag-name-filter` here.
