FROM denoland/deno
EXPOSE 3000
WORKDIR /app/backend
ADD . /app/backend
RUN deno install --entrypoint main.ts
CMD ["deno", "task", "dev"]