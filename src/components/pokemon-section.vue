<template>
  <div class="column is-one-third-tablet is-full-mobile pokemon">
    <div class="poke-details-section">
      <div
        class="pokemon-section"
        :class="pokemon.types[0].toLowerCase()"
        @click="pokeDetails()"
      >
        <div class="illustration"><img :src="pokemon.image" /></div>
        <div class="name">{{ capitalizer(pokemon.name) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pokemon: Object,
  },
  data() {
    return {
      detail: [],
      pokeImage: "",
    };
  },
  methods: {
    capitalizer(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    pokeDetails() {
      const query = {
        name: this.pokemon.name,
      };
      this.$router.push({
        path: `/detail/`,
        query,
      });
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
  }
  .pokemon-section {
    padding: 40px 16px 16px;
    background: #000000;
    border-radius: 4px;
    cursor: pointer;
    .illustration {
      background: #ffffff;
      display: flex;
      margin: 16px;
      height: 350px;
      img {
        flex: 1;
        margin: 48px 0;
        height: auto;
        object-fit: contain;
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
    .name {
      display: flex;
      align-items: center;
      justify-content: center;
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
