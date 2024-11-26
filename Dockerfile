FROM denoland/deno
EXPOSE 3000
WORKDIR /app
ADD . /app
RUN deno install --entrypoint main.ts
CMD ["deno", "task", "dev"]