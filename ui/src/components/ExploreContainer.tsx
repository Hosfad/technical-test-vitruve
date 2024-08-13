import { useEffect, useState } from 'react';
import './ExploreContainer.css';
import { Pokemon, PokemonData } from '../types';
import { useQuery } from 'react-query';
import { getPokemon } from '../requests';

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {

  const {data, isLoading, error, refetch} = useQuery(
    'pokemon',
    async () => await getPokemon('pikachu')
);


  return (
    <div className="container">

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};


export default ExploreContainer;
