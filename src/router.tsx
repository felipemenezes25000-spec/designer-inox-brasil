import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // As 25 URLs do site estão indexadas com barra final. O padrão do router é
    // remover a barra e redirecionar (307), o que trocaria toda URL indexada
    // por um redirect. Aqui a barra é a forma canônica.
    trailingSlash: "always",
  });

  return router;
};
