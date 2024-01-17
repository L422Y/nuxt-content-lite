<template>
  <span>
    ${{useState("currentProductPrice", () => 0)}}
  </span>
</template>
<style scoped>
span {
    color: darkred;
    font-weight: bolder;
    animation: wiggly 5s infinite;
    display: inline-block;
    font-size: 2rem;
}
@keyframes wiggly {
    0% {
        transform: rotate(0deg);
    }
    25% {
        transform: rotate(5deg);
    }
    50% {
        transform: rotate(0deg);
    }
    75% {
        transform: rotate(-5deg);
    }
    100% {
        transform: rotate(0deg);
    }
}
</style>
