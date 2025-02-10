// routers.tsx
import { createRootRoute, createRoute, redirect } from "@tanstack/react-router";
import Home from './views/home/pages/HomePage';
import { isAuthenticated } from "@/utils/auth";
import Layout from "@/components/layout";
import Login from "@/views/Login/pages/LoginPage"
import SignUp from "@/views/SignUp/pages/SignUpPage";
import Terms from "@/views/Terms/pages/TermsPage";


const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
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
  component: Login,
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
  component: SignUp,
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
  termsRoute
]);


