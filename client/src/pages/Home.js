import React from 'react';
import {useQuery} from '@apollo/client';
import { QUERY_THOUGHTS } from '../utils/queries';
import ThoughtList from '../components/ThoughtList';


const Home = () => {
  //use useQuery hook to make query requests
  const {loading, data} = useQuery(QUERY_THOUGHTS);

  //get thought data out of query's response and access data.thoughts
  const thoughts = data?.thoughts || [];
  console.log(thoughts);


  return (

    <main>
      <div className='flex-row justify-space-between'>
        <div className='col-12 mb-3'>
          {/* Ternary Operator to conditionally render ThoughtList component*/}
          {loading ? ( <div>loading...</div>) : (<ThoughtList thoughts={thoughts} title = "Some Feed for Thought(s)..."/>)}
        </div>
      </div>
    </main>
  );
};

export default Home;
