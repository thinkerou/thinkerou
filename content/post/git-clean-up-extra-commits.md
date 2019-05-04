---
title: Github 上给开源项目提交 PR 前如何清理无关的提交信息
categories: [
  "Git"
]
tags: [
  "Git"
]
date: 2016-06-17
image: "frustrated.jpg"
---

## 背景

最近在学习 [gRPC](https://github.com/grpc/grpc) 的过程中尝试给项目提一些代码，但是得到项目组的两位大牛回复说**提交代码时应该把无关的提交历史给删除**，具体回复是这样的：

@murgatroid99 [这么回复的](https://github.com/grpc/grpc/pull/6848)：

> Can you please send this PR without all of the irrelevant commits? All of the changes for this PR are in the second-to-last commit.

@ctiller [这么回复的](https://github.com/grpc/grpc/pull/6932)：    

> I'm not sure we want this to be blanket turned on for all platforms.

> Also, it'd be good to clean up some of the spurious unrelated commits here.

我能看懂他们说的是什么，就是说我提交代码时有太多的无关的提交历史应该清理了再提交，像[这样](/static/image/clean_up_commit_before.png)的：

![清理历史前的样子](/static/image/clean_up_commit_before.png)

这确实是个问题，那该如何清理呢？

## 解决方案

#### 1. 使用命令 `git checkout branch-name`

切换到待清理的分支：

    thinkerou@MacBook-Pro-thinkerou:~/Documents/opensource/grpc$ git checkout default_roots_pem
    Switched to branch 'default_roots_pem'

#### 2. 使用命令 `git rebase -i version-id`

指定 base 为需要删除的提交的前一次提交，其中 `version-id` 是通过命令 `git log` 根据需要选择的。

    thinkerou@MacBook-Pro-thinkerou:~/Documents/opensource/grpc$ git rebase -i fa9b7c1bc6488be17d18007f45c57dac39ea5b79
    Successfully rebased and updated refs/heads/default_roots_pem.
    
执行该命令后会弹出[文本信息](/static/image/clean_up_pick_before.png)，里面记录了相关的提交日志：

![清理文本信息前的样子](/static/image/clean_up_pick_before.png)

然后将里面无关的 `pick` 信息删除，就变成[这样](/static/image/clean_up_pick_after.png)的了：

![清理文本信息后的样子](/static/image/clean_up_pick_after.png)

保存文本后退出编辑，如果有冲突需要根据提示进行冲突处理。

当有冲突时，在保存文本文件退出后会有提示，然后运行 `git rebase --continue` 命令就会出现哪些文件产生了冲突：

    thinkerou@MacBook-Pro-thinkerou:~/Documents/opensource/grpc$ git rebase -i fa9b7c1bc6488be17d18007f45c57dac39ea5b79

    It seems that there is already a rebase-merge directory, and
    I wonder if you are in the middle of another rebase.  If that is the
    case, please try
	    git rebase (--continue | --abort | --skip)
    If that is not the case, please
	    rm -fr "/Users/thinkerou/Documents/opensource/grpc/.git/rebase-merge"
    and run me again.  I am stopping in case you still have something
    valuable there.
    
    thinkerou@MacBook-Pro-thinkerou:~/Documents/opensource/grpc$ git rebase --continue
    src/core/lib/surface/server.c: needs merge
    You must edit all merge conflicts and then
    mark them as resolved using git add

然后打开提示有冲突的文件，搜索 `<<<<` 或 `>>>>` 就能找到冲突的地方，进行合并处理后保存文件，并使用命令 `git add file-name` 进行文件添加。

然后继续运行 `git rebase --continue` 命令，这时会弹出文本信息，将刚刚修改的文件提交信息前的 `#` 去掉后保存。

重复上面的步骤，直到提示成功为止。

> 核心步骤：

> git rebase --continue

> 修改冲突文件并保存

> git add filename

> git rebase --continue

> 修改弹出的文本信息里关于 filename 文件提交信息前的 `#`

> 重复上述步骤直到提示成功方可进行正式提交

#### 3. 使用命令 `git push -f origin branch-name`

将更新提交到 `Github` 上，但是这里跟平常的 `push` 有所区别的是，需要参数 `-f` 执行强制提交，是因为当前本地的历史和远端的历史已经出现的分歧。

    thinkerou@MacBook-Pro-thinkerou:~/Documents/opensource/grpc$ git push -f origin default_roots_pem
    Username for 'https://github.com': thinkerou
    Password for 'https://thinkerou@github.com':
    Counting objects: 15, done.
    Delta compression using up to 4 threads.
    Compressing objects: 100% (13/13), done.
    Writing objects: 100% (15/15), 1.57 KiB | 0 bytes/s, done.
    Total 15 (delta 11), reused 0 (delta 0)
    To https://github.com/thinkerou/grpc.git
    + 1e60d3d...f3bc3b6 default_roots_pem -> default_roots_pem (forced update)

这些操作完成后，在源项目的 `Pull requests` 下就会变成[这样](/static/image/clean_up_commit_after.png)：

![清理历史后的样子](/static/image/clean_up_commit_after.png)

至此问题解决，结果看起来也清爽了很多。

## 参考资料

- [Git Branching-Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)

