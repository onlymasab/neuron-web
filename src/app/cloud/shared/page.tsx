"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import SharedHeader from "../components/shared_header";
import RecentFiles from "../components/recentFiles";
import { useCloudStore } from "@/stores/useCloudStore";
import  { createClient } from "@/lib/supabase/client";
import { CloudModel } from "@/types/CloudModel";

const Shared = () => {
  const { files, loading, fetchFiles } = useCloudStore();
  const [sharedFiles, setSharedFiles] = useState<{
    sharedWithMe: CloudModel[];
    sharedByMe: CloudModel[];
  }>({ sharedWithMe: [], sharedByMe: [] });

  const supabase = createClient();

  useEffect(() => {
    const fetchSharedFiles = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // User is not authenticated, do not fetch files
          return;
        }

        // Fetch files shared with current user
        const { data: sharedWithMe } = await supabase
          .from('cloud')
          .select('*')
          .contains('shared_with', [user.id])
          .eq('is_trashed', false);

        // Fetch files shared by current user
        const { data: sharedByMe } = await supabase
          .from('cloud')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_shared', true)
          .eq('is_trashed', false);

        setSharedFiles({
          sharedWithMe: sharedWithMe || [],
          sharedByMe: sharedByMe || []
        });

        // Also fetch regular files
        await fetchFiles(user.id);
      } catch (error) {
        console.error("Error fetching shared files:", error);
      }
    };

    fetchSharedFiles();

    // Set up realtime listener for shared files
    const channel = supabase
      .channel('shared-files-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'cloud',
        filter: 'is_shared=eq.true'
      }, (payload) => {
        console.log('Shared files change detected:', payload);
        fetchSharedFiles();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchFiles]);

  return (
    <div className="w-full h-full">
      <div className="pl-10 pr-5 2xl:px-15.5 flex flex-col h-full">
        <div className="py-[4.5vh]">
          <SharedHeader id="shared" />
        </div>
        <div className="flex items-center justify-center h-full">
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : !sharedFiles.sharedWithMe.length && !sharedFiles.sharedByMe.length ? (
            <div className="flex flex-col items-center justify-center text-2xl">
              <span className="text-[clamp(1rem,2vw,2rem)] font-semibold">
                No shared files yet
              </span>
              <Image 
                src="/images/share_img.png" 
                alt="Share" 
                width={256} 
                height={256} 
                className="size-[13vw]" 
                priority
              />
            </div>
          ) : (
            <div className="w-full overflow-y-scroll no-scrollbar h-[70vh]">
              <RecentFiles 
                id="shared"
                files={sharedFiles.sharedWithMe}
                sharedByMe={sharedFiles.sharedByMe}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shared;