import React from "react";
import Tweet from "../../../../../server_back/models/Tweet";

const Thread = (start_tweet_id, rest_posts) => {
  // rest_posts посты одного автора с постами, комментируют сами себя
  // собственоо задача граматно их отразить друг за другом чтобы логика не нарушалась
  // типо не рандомно раскидать а по схеме post->com -> com -> com -> com -> com и тд;
  // хз как это блять сделать вообщем никаких блять идей ты тупой мертвый ни на что не спосоьный тупой дегенрат
  //
  return (
    <>
      {rest_posts.map((post) => {
        return (
          <Tweet
            key={post._id}
            author={user == "-" ? post.author : user}
            content={post.content}
            date={post.createdAt}
            id={post._id}
            likes={post.likes}
            likedBy={post.likedBy}
            comments={post.comments}
          />
        );
      })}
    </>
  );
};

export default Thread;
