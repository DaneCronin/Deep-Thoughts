import React from 'react';
import {Navigate, useParams} from 'react-router-dom';
import Auth from '../utils/auth';

//Import Component
import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';

import {useQuery} from '@apollo/client';
import {QUERY_USER, QUERY_ME} from '../utils/queries';

const Profile = (props) => {
  //check if there is a value for the username in the URL
  const {username: userParam} = useParams();

  //useQuery check to check value if it is anohter user's pofile, no value if it is ours- 
  const {loading, data} = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: {username: userParam}
  });

  const user = data?.me || data?.user || {};

  //navigate to personal profile page if username is the logged in user's
  if(Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to= '/profile'/>;
  }

  if(loading) {
    return <div>Loading...</div>
  }


//Add error handling if navigate to /profile in url and not logged in
if (!user?.username) {
  return (
    <h4>
      You need to be logged in to see this page. Use the navigation links above to sign up or log in !
    </h4>
  );
}

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          {/* if a userParam doesn't exist, then it will say viewing your profile, otherwise will say viewing 'Usernames' profile */}
          Viewing {userParam ? `${user.username}'s ` : 'your'} profile.
        </h2>
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
           <ThoughtList thoughts={user.thoughts} title={`${user.username}'s thoughts...`} />
           </div>

        <div className="col-12 col-lg-3 mb-3">
          <FriendList 
          username={user.username}
          friendCount={user.friendCount}
          friends={user.friends}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
