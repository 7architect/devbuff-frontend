curl -d '{"chat_id":"'"$TG_CHAT_ID"'","photo":"https://api.travis-ci.com/7architect/devbuff-frontend.png?token=KpNyjhzrpjT79DwToHzr&branch=develop","parse_mode":"markdown","text":"Devbuff frontend build was finished","caption":"frontend #build #'"$TRAVIS_EVENT_TYPE"' '"$TRAVIS_BUILD_NUMBER"'\n\n**[🔀'"$TRAVIS_COMMIT"'](https://github.com/7architect/devbuff-frontend/commit/'"$TRAVIS_COMMIT"')**\: *'"$TRAVIS_COMMIT_MESSAGE"'*\n\n**☑️ Tests** '"$TRAVIS_TEST_RESULT"'","reply_markup":{"inline_keyboard":[[{"text":"🔀 View commit","url":"https://github.com/7architect/devbuff-frontend/commit/'"$TRAVIS_COMMIT"'"},{"text":"🕜 View job","url":"http://example.com/'"$TRAVIS_JOB_WEB_URL"'"}]]}}'  -H "Content-Type: application/json" -X POST https://api.telegram.org/bot$TG_BOT_TOKEN/sendPhoto
