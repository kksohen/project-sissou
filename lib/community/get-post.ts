import db from "../db";

export async function getPost(id: number){
  try{
    const post = await db.post.update({//바뀐 조회수 반영해주기 위해 findUnique 대신 update 사용
    where:{
      id
    },
    data:{
      views:{
        increment: 1 //조회수 증가
      }
    }
    ,
    include:{
      user: {
        select: {
          username: true,
          avatar: true
        }
      },
      _count:{
        select:{
          comments: true,
          // likes: true
        }
      },
      comments: {
        select: {
          id: true,
          payload: true,
          userId: true,
          created_at: true,
          user: {
            select: {
              username: true,
              avatar: true
            }
          }
        },
      }
    },
  });
  return post;
  }catch(e){
    console.error(e);
    return null;
  }
}

export async function getLikeStatus(postId: number, userId: number){
  // const session = await getSession();
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        // userId: session.id!
        userId
      }
    }
  });
  const likeCount = await db.like.count({
    where: {
      postId
    }
  });
  return {isLiked:Boolean(isLiked),
    likeCount};
}