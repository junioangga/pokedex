<template>
  <div class="column is-one-third-tablet is-half-mobile pokemon">
    <div class="poke-details-section">
      <img
        alt="catch"
        class="catch"
        @click="favoritePoke(pokemon, pokeImage, type)"
        src="../assets/pokeball.png"
      />
      <div class="pokemon-section" :class="type" @click="pokeDetails()">
        <div class="illustration"><img :src="pokeImage" /></div>
        <div class="name">{{ capitalizer(pokemon) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    pokemon: String,
  },
  data() {
    return {
      detail: [],
      pokeImage: "",
    };
  },
  created() {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${this.pokemon}`)
      .then((res) => {
        this.pokeImage =
          res.data.sprites.other["official-artwork"].front_default;
        this.type = res.data.types[0].type.name;
      });
  },
  methods: {
    capitalizer(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    pokeDetails() {
      const query = {
        name: this.pokemon,
      };
      this.$router.push({
        path: `/detail/`,
        query,
      });
    },
    favoritePoke(name, image, type) {
      const pokemonData = { name, image, type };
      this.$emit("poke-fav", pokemonData);
    },
  },
};
</script>

<style lang="scss">
.pokemon {
  .container {
    padding: 0 16px;
  }
  .poke-details-section {
    position: relative;
    .catch {
      position: absolute;
      width: 30px;
      height: 30px;
      top: 5px;
      right: 10px;
      cursor: pointer;
    }
  }
  .pokemon-section {
    padding: 40px 16px 16px;
    background: #000000;
    border-radius: 4px;
    cursor: pointer;
    .illustration {
      background: #ffffff;
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
    .name {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 16px;
      color: #ffffff;
      font-size: 20px;
      font-weight: bold;
    }
  }
  .fire {
    background: #ee8130;
  }
}
</style>
