import React, { useEffect } from "react";
import Tweet from "../Tweet/Tweet";
import "./ListTweet.css";
import postSlice, { changed_id, update } from "../../fearutures/postSlice";
import { useSelector, useDispatch } from "react-redux";
import Model from "../Model/Model";
import EmptyList from "../EmptyList/EmptyList";

const ListTweet = ({ posts, user }) => {
  console.log(posts);

  // нужно сохдать структуру которая будет раскладывать твиты по веткам и подгружать сооствествующий css

  /*
вообщем как это может в теории выглдеть 
{
  id_main_tweet = [10 tweets ]
}
такой подход отсосен по многим причинам в том числе по тому что мы пикам не друг за дрцгам твиты а просто кучей

в теории у каждого твита есть comTo который связывает его с твитом основателем и нужно как-то используя это поле пробежаться по комментам и отобразить
короче нужно сидеть и обдумывать потому что пиздатые идеи не достигли мозга

{
  id_main_tweet = 2c -> 3c -> 4c -> 5c;
  3c_id = 4_alt_c -> 5_alt_c;
}

в теории для каждого твита где comTo == null можно добавить тред но будеи опять всё через жопу отображаться
основа фронта это треды которые нужно красиво организовать
как это блять сделать сука -------

*/
  let check_arr = posts.filter((post) => post.commentTo !== null);
  let allowed_posts = posts.filter((post) => post.commentTo == null);
  // console.log(check_arr);
  // если сейчас делать локально то нудеа фнкция которая зашьёт в комменты потенциальный тред

  // короче сейчас придалим возсожность тивитам формировать треды

  const current_thread = (id) => {
    let our_arr = [];
    let cur_posts = posts.filter((post) => post.commentTo == id);
    our_arr = our_arr.concat(cur_posts);
    for (let i = 0; i < cur_posts.length; i++) {
      let new_arr = current_thread(cur_posts[i]._id);
      if (new_arr.length !== 0) {
        our_arr = our_arr.concat(new_arr);
      }
    }
    return our_arr;
  };
  console.log(current_thread("620e3cee58552da1d809ff35"));

  return (
    <>
      <div className="list_tweets">
        {allowed_posts.length > 0 ? (
          allowed_posts.map((post) => {
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
                thread={current_thread(post._id)}
                type="base"
              />
            );
          })
        ) : (
          <EmptyList />
        )}

        <Model id="editmodel" operation="EDIT" />
        <Model id="commentmodel" operation="COMMENT" />
      </div>
    </>
  );
};

export default ListTweet;
