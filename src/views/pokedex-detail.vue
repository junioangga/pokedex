<template>
  <div
    class="pokedex-detail"
    :class="pokemon.types ? pokemon.types[0].toLowerCase() : 'no-show'"
  >
    <loading v-model:active="loading" :is-full-page="fullPage" />
    <div class="poke-top-header">
      <div class="container">
        <img @click="backhome" alt="pokemon" src="../assets/pokemon.png" />
      </div>
    </div>
    <div class="container">
      <div class="columns is-mobile is-multiline no-margin">
        <div class="column">
          <div class="poke-header">
            <h1>{{ pokemon.name }}</h1>
          </div>
          <div class="poke-types">
            <div
              class="poke-types-bullets"
              v-for="(type, m) in pokemon.types"
              :key="m"
            >
              {{ type }}
            </div>
          </div>
        </div>
        <div class="column detail-tabs is-full">
          <div class="detail-holder">
            <img :src="pokemon.image" />
          </div>
          <div
            v-if="pokemon.evolutions"
            class="columns is-multiline is-mobile statboxes evolution"
          >
            <div class="column is-half-desktop is-full-mobile">
              <div class="statbox">
                <div
                  class="header"
                  :class="
                    pokemon.types ? pokemon.types[0].toLowerCase() : 'no-show'
                  "
                >
                  Evolutions
                </div>
                <div
                  class="content"
                  :class="
                    pokemon.evolutions.length > 1
                      ? 'justify-space'
                      : 'justify-center'
                  "
                >
                  <div
                    v-for="(evolution, p) in pokemon.evolutions"
                    :key="p"
                    class="evolution-box"
                    @click="pokeDetails(evolution.name)"
                  >
                    <div
                      class="header"
                      :class="
                        pokemon.types
                          ? pokemon.types[0].toLowerCase()
                          : 'no-show'
                      "
                    >
                      {{ pokemon.evolutions[p].name }}
                    </div>
                    <div class="content">
                      <img :src="pokemon.evolutions[p].image" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="columns is-multiline is-mobile statboxes">
            <div
              class="column is-half-desktop is-full-mobile"
              v-for="(stat, i) in stats"
              :key="i"
            >
              <div
                class="statbox"
                :class="
                  pokemon.types ? pokemon.types[0].toLowerCase() : 'no-show'
                "
              >
                <div
                  class="header"
                  :class="
                    pokemon.types ? pokemon.types[0].toLowerCase() : 'no-show'
                  "
                >
                  {{ stat.name }}
                </div>
                <div class="content">
                  {{ stat.value }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
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
      loading: false,
      fullPage: false,
      tabActive: 0,
      pokemon: [],
      flavorText: [],
      pokeStats: [],
      moveList: [],
      pokemonTypeColor: "",
      pokemonType: [],
      stats: [],
    };
  },
  components: {
    Loading,
  },
  created() {
    this.fetchPokemon();
  },
  methods: {
    fetchPokemon() {
      this.loading = true;
      const POKEMON_QUERY = gql`
        query PokemonList($name: String!) {
          pokemon(name: $name) {
            id
            number
            name
            weight {
              minimum
              maximum
            }
            height {
              minimum
              maximum
            }
            classification
            types
            resistant
            weaknesses
            fleeRate
            maxCP
            evolutions {
              id
              image
              name
            }
            evolutionRequirements {
              amount
              name
            }
            attacks {
              fast {
                name
                type
                damage
              }
              special {
                name
                type
                damage
              }
            }
            maxHP
            image
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
          name: this.$route.query.name,
        })
      );
      watchEffect(() => {
        if (result.value) {
          this.pokemon = result.value["pokemon"];
          const fastAttacks = this.pokemon.attacks.fast.map(function (item) {
            return item["name"];
          });
          const specialAttacks = this.pokemon.attacks.special.map(function (
            item
          ) {
            return item["name"];
          });
          this.stats = [
            {
              name: "Weight Range",
              value: `${this.pokemon.weight.minimum} - ${this.pokemon.weight.maximum}`,
            },
            {
              name: "Height Range",
              value: `${this.pokemon.height.minimum} - ${this.pokemon.height.maximum}`,
            },
            {
              name: "Classification",
              value: this.pokemon.classification,
            },
            {
              name: "Fast Attacks",
              value: fastAttacks.join(", "),
            },
            {
              name: "Special Attacks",
              value: specialAttacks.join(", "),
            },
            {
              name: "Resistances",
              value: this.pokemon.resistant.join(", "),
            },
            {
              name: "Weaknesses",
              value: this.pokemon.weaknesses.join(", "),
            },
          ];
          this.loading = false;
          this.scrolled = false;
        }
      });
    },
    pokeDetails(name) {
      const query = {
        name: name,
      };
      this.$router
        .push({
          path: `/detail/`,
          query,
        })
        .then(() => {
          location.reload();
        });
    },
    backhome() {
      this.$router.push({
        path: `/`,
      });
    },
  },
};
</script>

<style lang="scss">
.pokedex-detail {
  background: #000000;
  min-height: 100vh;
  .poke-top-header {
    padding: 32px 0 16px;
    display: flex;
    justify-content: space-between;
    background: #ffffff;
    .container {
      padding: 0 16px;
    }
    img {
      width: 100px;
      height: auto;
      cursor: pointer;
    }
  }
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
  .poke-header {
    padding: 16px;
    color: #ffffff;
    i {
      cursor: pointer;
    }
  }
  .poke-types {
    display: flex;
    padding: 0 16px;
    .poke-types-bullets {
      padding: 5px 10px;
      border: 1px solid #000000;
      border-radius: 10px;
      color: #ffffff;
      font-weight: bold;
      margin-right: 5px;
      background: linear-gradient(
        rgba(102, 102, 102, 0.7),
        rgba(102, 102, 102, 0.1)
      );
    }
  }
  .detail-holder {
    position: relative;
    display: flex;
    justify-content: center;
    background: white;
    img {
      position: relative;
      z-index: 100;
    }
  }
  .no-margin {
    margin: 0;
  }
  h1 {
    font-weight: bold;
    font-size: 30px;
  }
  .detail-tabs {
    background: white;
    border-top-left-radius: 45px;
    border-top-right-radius: 45px;
    padding-top: 30px;
    padding-bottom: 30px;
    .statboxes {
      padding: 30px 0;
      &.evolution {
        display: flex;
        justify-content: center;
        .statbox {
          .content {
            display: flex;
            &.justify-space {
              justify-content: space-between;
            }
            &.justify-center {
              justify-content: center;
            }
            img {
              max-height: 150px;
            }
            .evolution-box {
              width: 46%;
              border-radius: 5px;
              border: #000000 1px solid;
              cursor: pointer;
              .content {
                display: flex;
                justify-content: center;
              }
            }
          }
        }
      }
      .statbox {
        border: 1px solid;
        border-radius: 5px;
        .header {
          padding: 16px;
          font-size: 16px;
          color: #ffffff;
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
        }
        .content {
          padding: 16px;
          font-size: 18px;
        }
        &.normal {
          border-color: #a8a77a;
        }
        &.fire {
          border-color: #ee8130;
        }
        &.water {
          border-color: #6390f0;
        }
        &.electric {
          border-color: #f7d02c;
        }
        &.grass {
          border-color: #7ac74c;
        }
        &.ice {
          border-color: #96d9d6;
        }
        &.fighting {
          border-color: #c22e28;
        }
        &.poison {
          border-color: #a33ea1;
        }
        &.ground {
          border-color: #e2bf65;
        }
        &.flying {
          border-color: #a98ff3;
        }
        &.psychic {
          border-color: #f95587;
        }
        &.bug {
          border-color: #a6b91a;
        }
        &.rock {
          border-color: #b6a136;
        }
        &.ghost {
          border-color: #735797;
        }
        &.dragon {
          border-color: #6f35fc;
        }
        &.dark {
          border-color: #705746;
        }
        &.steel {
          border-color: #b7b7ce;
        }
        &.fairy {
          border-color: #d685ad;
        }
      }
    }
  }
}
</style>
