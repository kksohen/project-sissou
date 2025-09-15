import TakeLiked from './take-liked';
import TakeCommented from './take-commented';

export interface TakeUserActivityProps{
  userId: number;
};

export default function TakeUserActivity({userId}: TakeUserActivityProps){
  return(
    <div className="pt-40 sm:pt-45 lg:pt-48 mb-10 sm:mb-40">
      
      <div className="flex flex-col gap-2">
        <TakeLiked userId={userId}/>
        <TakeCommented userId={userId}/>
      </div>
    </div>
  );
}