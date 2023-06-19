<!-- <script setup>
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { computed, watchEffect } from "vue";

const POKEMON_QUERY = gql`
  query PokemonList {
    pokemons(first: 150) {
      name
      classification
      id
      number
      image
      types
    }
  }
`;

const { result } = useQuery(POKEMON_QUERY);
const pokemons = computed(() => result.value?.pokemons ?? []);

watchEffect(() => {
  console.log("pokemons", pokemons.value);
});
</script> -->

<template><router-view /></template>
