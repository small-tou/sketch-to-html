ESLINT_PATH=./node_modules/.bin/eslint


# http://stackoverflow.com/questions/20435593/git-diff-during-pre-commit-hook-results-in-not-a-git-repository#comment30528128_20435742
# ⬆️ unset GIT_DIR
diff-lint:
	@unset GIT_DIR && for file in `git diff --cached --name-status | awk '$$1 != "R" {print $$2}' | grep js$$ | cat`; do \
		echo Test for $$file; \
		$(ESLINT_PATH) `echo $$file | awk -F web/ '{ print $$2 }'`; \
	done;

@PHONY: diff-lint
