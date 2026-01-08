import IndexComponent from "./index";
import fetchList from "./store/actions/fetchList";

export default {
  path: "game",
  Component: IndexComponent,
  loader: () => {
    fetchList();
  },
};
