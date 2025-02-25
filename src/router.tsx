// routers.tsx
import { createRootRoute, createRoute, redirect } from "@tanstack/react-router";
import Home from './views/home/pages/HomePage';
import { isAuthenticated } from "@/utils/auth";
import Layout from "@/components/layout";
import Login from "@/views/Login/pages/LoginPage"
import SignUp from "@/views/SignUp/pages/SignUpPage";
import Terms from "@/views/Terms/pages/TermsPage";
import Favorites from "./views/Favorites/pages/FavoritesPage";
import AuthGuard from "./components/AuthGuard";


const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <AuthGuard requireAuth={true}>
      <Home/>
    </AuthGuard>
  ),
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/login",
      });
    }
  },
});


const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/favourites",
  component: () => (
    <AuthGuard requireAuth={true}>
      <Favorites/>
    </AuthGuard>
  ),
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/login",
      });
    }
  },
});




const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <AuthGuard requireAuth={false}>
      <Login />
    </AuthGuard>
  ),
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({
        to: "/",
      });
    }
  },
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: () => (
    <AuthGuard requireAuth={false}>
      <SignUp />
    </AuthGuard>
  ),
});

// const testRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/test',
//   component: Test
// })


const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: Terms
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signUpRoute,
  termsRoute,
  favoritesRoute
]);


