import { useQuery } from 'react-query';
import { getPokemon } from '../requests';

interface ContainerProps {
  name: string;
}

const PokemonCard: React.FC<ContainerProps> = ({ name }) => {

  const {data, isLoading, error, refetch} = useQuery(
    'pokemon',
    async () => await getPokemon(name)
);


  return (
    <div className="container">

      <pre className="">
        {name}
      </pre>
    </div>
  );
};


export default PokemonCard;
