RUN npm i --force

Run touch .env.local

create an upstash account to work with redis

copy contents of .env.example to .env.local and add secrets from upstash

RUN npm run dev

RUN http://localhost:3000/api/post-data
