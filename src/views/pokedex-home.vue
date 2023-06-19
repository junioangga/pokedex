<template>
  <div class="pokedex-home">
    <loading v-model:active="loading" :is-full-page="fullPage" />
    <div class="container">
      <div class="poke-header">
        <img @click="reload" alt="pokemon" src="../assets/pokemon.png" />
        <div class="select">
          <select v-model="typeValue">
            <option
              v-for="(type, l) in pokemonTypes"
              :key="l"
              :value="type.value"
            >
              {{ type.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="columns is-multiline is-mobile">
        <pokemon
          v-for="(pokemon, i) in pokemonList"
          :key="i"
          :pokemon="pokemon"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import Pokemon from "@/components/pokemon-section.vue";

import { watchEffect } from "vue";
import { useQuery, provideApolloClient } from "@vue/apollo-composable";
import gql from "graphql-tag";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";

export default {
  data() {
    return {
      pokemonList: [],
      first: 15,
      typeValue: "all",
      loading: false,
      fullPage: true,
      scrolled: false,
      modalActive: false,
      pokemonTypes: [
        {
          value: "all",
          name: "All types",
        },
        {
          value: "Normal",
          name: "Normal",
        },
        {
          value: "Fire",
          name: "Fire",
        },
        {
          value: "Water",
          name: "Water",
        },
        {
          value: "Grass",
          name: "Grass",
        },
        {
          value: "Electric",
          name: "Electric",
        },
        {
          value: "Ice",
          name: "Ice",
        },
        {
          value: "Fighting",
          name: "Fighting",
        },
        {
          value: "Poison",
          name: "Poison",
        },
        {
          value: "Ground",
          name: "Ground",
        },
        {
          value: "Flying",
          name: "Flying",
        },
        {
          value: "Psychic",
          name: "Psychic",
        },
        {
          value: "Bug",
          name: "Bug",
        },
        {
          value: "Rock",
          name: "Rock",
        },
        {
          value: "Ghost",
          name: "Ghost",
        },
        {
          value: "Dragon",
          name: "Dragon",
        },
        {
          value: "Fairy",
          name: "Fairy",
        },
      ],
      selectedType: null,
    };
  },
  components: {
    Pokemon,
    Loading,
  },
  created() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.fetchPokemon();
  },
  mounted() {
    window.addEventListener("scroll", this.onPageScroll);
  },
  unmounted() {
    window.removeEventListener("scroll", this.onPageScroll);
  },
  watch: {
    typeValue(value) {
      this.typeChange(value);
    },
    pokemonList(value) {
      this.filterType(value);
    },
  },
  methods: {
    reload() {
      location.reload();
    },
    filterType(value) {
      if (this.selectedType) {
        this.pokemonList = value.filter(
          (singularPokemon) => !singularPokemon.types.indexOf(this.selectedType)
        );
      }
    },
    typeChange(type) {
      if (type === "all") {
        this.selectedType = null;
      } else {
        this.selectedType = type;
      }
      this.fetchPokemon(type);
    },
    capitalizer(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    modalOpen() {
      this.modalActive = true;
      document.body.style.overflowY = "hidden";
      document.getElementsByTagName("html")[0].style.overflowY = "hidden";
      document.body.style.height = "100%";
    },
    modalClose() {
      this.modalActive = false;
      document.body.style.overflowY = "auto";
      document.getElementsByTagName("html")[0].style.overflowY = "auto";
      document.body.style.height = "auto";
    },
    fetchPokemon(type) {
      this.loading = true;
      if (type) {
        this.pokemonList = [];
        if (type === "all" || !type) {
          this.first = 15;
        } else {
          this.first = 150;
        }
      }
      const POKEMON_QUERY = gql`
        query PokemonList($first: Int!) {
          pokemons(first: $first) {
            name
            classification
            id
            number
            image
            types
          }
        }
      `;
      const httpLink = createHttpLink({
        uri: "https://graphql-pokemon2.vercel.app/",
      });

      const cache = new InMemoryCache();
      const apolloClient = new ApolloClient({
        link: httpLink,
        cache,
      });
      const { result } = provideApolloClient(apolloClient)(() =>
        useQuery(POKEMON_QUERY, {
          first: this.first,
        })
      );
      watchEffect(() => {
        if (result.value) {
          this.pokemonList = result.value["pokemons"];
          this.loading = false;
          this.scrolled = false;
        }
      });
    },
    pokeDetailsPage(name) {
      const query = {
        name,
      };
      this.$router.push({
        path: `/detail/`,
        query,
      });
    },
    onPageScroll() {
      if (
        window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight - 40
      ) {
        if (!this.scrolled) {
          this.scrolled = true;
          if (this.selectedType === null) {
            if (this.first < 150) {
              this.first = this.first + 15;
              this.fetchPokemon();
            }
          }
        }
      }
    },
  },
};
</script>

<style lang="scss">
.pokedex-home {
  .container {
    position: relative;
  }
  padding: 16px;
  position: relative;
  .poke-header {
    padding: 16px 0;
    display: flex;
    justify-content: space-between;
    img {
      width: 100px;
      height: auto;
      cursor: pointer;
    }
  }
  .empty {
    margin-top: 20px;
    font-weight: bold;
    font-size: 18px;
  }
  .modal-header {
    display: flex;
    align-content: center;
    margin-bottom: 16px;
    span {
      font-size: 20px;
    }
  }
  .modal-section-parent {
    position: relative;
    .close {
      color: #ffffff;
      position: absolute;
      top: 21px;
      right: 26px;
      z-index: 40;
      font-size: 20px;
      cursor: pointer;
    }
    .modal-section {
      display: flex;
      background: #8f8e8e;
      color: #ffffff;
      font-weight: bold;
      border-radius: 4px;
      padding: 16px;
      position: relative;
      cursor: pointer;
      &.normal {
        background: #a8a77a;
      }
      &.fire {
        background: #ee8130;
      }
      &.water {
        background: #6390f0;
      }
      &.electric {
        background: #f7d02c;
      }
      &.grass {
        background: #7ac74c;
      }
      &.ice {
        background: #96d9d6;
      }
      &.fighting {
        background: #c22e28;
      }
      &.poison {
        background: #a33ea1;
      }
      &.ground {
        background: #e2bf65;
      }
      &.flying {
        background: #a98ff3;
      }
      &.psychic {
        background: #f95587;
      }
      &.bug {
        background: #a6b91a;
      }
      &.rock {
        background: #b6a136;
      }
      &.ghost {
        background: #735797;
      }
      &.dragon {
        background: #6f35fc;
      }
      &.dark {
        background: #705746;
      }
      &.steel {
        background: #b7b7ce;
      }
      &.fairy {
        background: #d685ad;
      }
      .image {
        width: 60px;
        height: 60px;
      }
      .content {
        display: flex;
        align-items: center;
        margin-bottom: 0;
      }
    }
  }
}
</style>
