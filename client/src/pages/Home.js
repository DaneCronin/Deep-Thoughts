import React from 'react';
import {useQuery} from '@apollo/client';
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';
import ThoughtList from '../components/ThoughtList';
import Auth from '../utils/auth';
import FriendList from '../components/FriendList';


const Home = () => {
   
  //use useQuery hook to make query requests
  const {loading, data} = useQuery(QUERY_THOUGHTS);
  //Use QUERY_ME_BASIC query to retrieve friend list. Use object destructuring to extract 'data' from useQuery hooks response and rename it to userData
  const {data: userData} = useQuery(QUERY_ME_BASIC);

  //get thought data out of query's response and access data.thoughts
  const thoughts = data?.thoughts || [];

   //create logged in variable that will be true if logged in
   const loggedIn = Auth.loggedIn();


 // console.log(thoughts);


  return (

    <main>
      <div className='flex-row justify-space-between'>
        {/* Conditinonally render homepage if logged in to have 2 columns  */}
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
          {/* Ternary Operator to conditionally render ThoughtList component -if loading show 'Loading', if not show 'thoughts component'*/}
          {loading ? ( <div>loading...</div>) : (<ThoughtList thoughts={thoughts} title = "Some Feed for Thought(s)..."/>)}
        </div>
        {/* if user logged in, conditionally render friend list in righthand column */}
        {loggedIn && userData ? (
          <div className='col-12 col-lg-3 mb-3'>
            <FriendList
            username= {userData.me.username}
            friendCount= {userData.me.friendCount}
            friends= {userData.me.friends}/>
          </div>
        ) : null}

      </div>
    </main>
  );
};

export default Home;
