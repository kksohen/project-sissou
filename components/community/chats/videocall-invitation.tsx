interface VideoCallInvitationProps{
  onAccept: ()=> void;
  onDecline: ()=> void;
};

export default function VideoCallInvitation({onAccept, onDecline}: VideoCallInvitationProps){
  return(
    <div className="fixed left-1/2 -translate-x-1/2 -bottom-8 md:-bottom-10 lg:-bottom-11">
        <div className="flex gap-2
        text-xs md:text-sm lg:text-base 
        username-spacing-desc font-weight-basic
        leading-3 md:leading-4 form-text-color
        *:border-[0.0625rem] *:border-[var(--ring-color)]
        *:transition-all *:rounded-full
        *:py-1.5 *:lg:py-2 *:px-2 *:md:px-2.5 *:lg:px-2.75 *:drop-shadow-md *:shadow-md">
          
          <button onClick={onAccept} data-cursor-target
          className="form-bg-color hover:bg-primary">참여</button>

          <button onClick={onDecline} data-cursor-target
          className="form-bg-color hover:bg-[var(--color-error)]">거절</button>
        </div>
    </div>
  );
}