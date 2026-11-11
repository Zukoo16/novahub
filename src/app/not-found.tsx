import { Button, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="font-mono text-sm font-bold uppercase tracking-[0.3em] text-brand-light">
        404
      </div>
      <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
        Такой страницы нет
      </h1>
      <p className="mt-3 max-w-md text-zinc-400">
        Возможно, ссылка устарела или страница была перемещена.
      </p>
      <div className="mt-8 flex gap-3">
        <Button href="/">На главную</Button>
        <Button href="/courses" variant="outline">
          Каталог курсов
        </Button>
      </div>
    </Container>
  );
}
