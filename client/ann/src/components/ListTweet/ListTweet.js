import React, { useEffect } from "react";
import Tweet from "../Tweet/Tweet";
import "./ListTweet.css";
import postSlice, { changed_id, update } from "../../fearutures/postSlice";
import { useSelector, useDispatch } from "react-redux";
import Model from "../Model/Model";
import EmptyList from "../EmptyList/EmptyList";

const ListTweet = ({ posts, user, protocol }) => {
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

  /*
  короче нуджо сделать так чтобы у треда динамически считалась длина треда и соотвественоо если > 3 твитов, то должны отображаться 
  2 last ones и кнопка показать тред 
  как-то это нужно имплеиентировать но как .... 

*/
  let allowed_posts;
  const user_id = localStorage.getItem("user_id");
  //   let check_arr = posts.filter((post) => post.commentTo !== null);

  if (protocol == "base") {
    allowed_posts = posts.filter((post) => post.commentTo == null);
  }
  if (protocol == "likes") {
    allowed_posts = posts;
  }
  if (protocol == "thread") {
    allowed_posts = posts.filter((item) => item.threadId == null);
  }
  if (protocol == "profile_tweets") {
    allowed_posts = posts.filter((item) => item.threadId == null);
  }

  if (protocol == "choosen_post") {
    allowed_posts = posts;
  }

  // console.log(check_arr);
  // если сейчас делать локально то нудеа фнкция которая зашьёт в комменты потенциальный тред

  // короче сейчас придалим возсожность тивитам формировать треды

  // эта функция собтрает твиты в треды
  // разработать логику которая будет понимать длину нашего треда и отображать 1 твит + конпка посмоьреть конпки + 2 посдних твита
  const current_thread = (id, author) => {
    //    console.log(el._id);

    let our_arr = [];
    let cur_posts = posts.filter(
      (post) => post.commentTo == id && post.author._id == author
    );
    cur_posts.sort((b, a) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    if (cur_posts.length > 0) {
      cur_posts = [cur_posts[0]];
      //console.log(next_posts);
    }

    our_arr = our_arr.concat(cur_posts);
    for (let i = 0; i < cur_posts.length; i++) {
      let new_arr = current_thread(cur_posts[i]._id, author);
      if (new_arr.length !== 0) {
        our_arr = our_arr.concat(new_arr);
      }
    }
    return our_arr;
  };

  const alt_current_thread = (id, author) => {
    let possible_posts = posts.filter((post) => post.commentTo == id);
  };
  return (
    <>
      <div className="list_tweets">
        {allowed_posts.length > 0 ? (
          allowed_posts.map((post) => {
            //            let thread = current_thread(post._id, post.author._id);
            let thread;
            if (protocol !== "thread") {
              thread = posts.filter((item) => item.threadId == post._id);
              thread.sort((b, a) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
              });
            } else {
              thread = posts.filter((item) => item !== post);
            }

            return (
              <Tweet
                key={post._id}
                author={post.author}
                content={post.content}
                date={post.createdAt}
                id={post._id}
                likes={post.likes}
                likedBy={post.likedBy}
                thread={thread}
                type={post.threadId == null ? "base" : "comment"}
                replyTo={post.commentTo}
                origin_length={thread.length}
                protocol={protocol}
                comments={post.comments}
              />
            );
          })
        ) : (
          <EmptyList protocol={protocol} />
        )}

        <Model id="editmodel" operation="EDIT" />
        <Model id="commentmodel" operation="COMMENT" />
      </div>
    </>
  );
};

export default ListTweet;
