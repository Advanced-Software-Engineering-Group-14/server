export default {
  ...(require("./manager").default),
  ...(require("./driver").default),
  ...(require("./homeowner").default),
}