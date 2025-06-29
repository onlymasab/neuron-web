"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ChevronIcon } from "./icons";

interface RecentFilesProps {
  id: string;
}

interface FileData {
  id: string;
  name: string;
  size: string;
  updated_at: string;
  file_url: string;
  shared_emails: string[];
}

const RecentFiles = ({ id }: RecentFilesProps) => {
  const supabase = createClient();

  const [recentFiles, setRecentFiles] = useState<FileData[]>([]);
  const [checkedState, setCheckedState] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleCheckbox = (index: number) => {
    setCheckedState((prev) =>
      prev.map((checked, i) => (i === index ? !checked : checked))
    );
  };

  const toggleSelectAll = () => {
    const areAllChecked = checkedState.every(Boolean);
    setCheckedState(recentFiles.map(() => !areAllChecked));
  };

  useEffect(() => {
    const fetchSharedFiles = async () => {
      setLoading(true);

      // Step 1: Get user email from id
      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", id)
        .single();

      const userEmail = profile?.email;

      if (!userEmail) {
        setRecentFiles([]);
        setCheckedState([]);
        setLoading(false);
        return;
      }

      // Step 2: Get shared files where this email is in shared_emails array
      const { data: files, error } = await supabase
        .from("shared_files_with_emails")
        .select("*")
        .contains("shared_emails", [userEmail]);

      if (error || !files) {
        setRecentFiles([]);
        setCheckedState([]);
        setLoading(false);
        return;
      }

      setRecentFiles(files);
      setCheckedState(new Array(files.length).fill(false));
      setLoading(false);
    };

    fetchSharedFiles();
  }, [id]);

  if (loading) {
    return <p className="text-muted text-sm">Loading files...</p>;
  }

  if (recentFiles.length === 0) {
    return <p className="text-muted text-sm">No files shared with this user.</p>;
  }

  return (
    <div className="w-full flex flex-col gap-2 h-full">
      {/* HEADER ROW */}
      <div className="flex gap-4 justify-between items-center py-[clamp(1vh,1.5vh,2vh)] max-2xl:pl-8 px-6 bg-white rounded-md">
        <button onClick={toggleSelectAll} className="pr-8 active:scale-90 transition-all duration-300">
          {checkedState.every(Boolean) ? (
            <svg width="16px" height="16px" viewBox="0 0 24 24" fill="#0956d3" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 1.25C6.06 1.25 1.25 6.06 1.25 12S6.06 22.75 12 22.75 22.75 17.94 22.75 12 17.94 1.25 12 1.25ZM7.53 11.97a.75.75 0 10-1.06 1.06l3 3a.75.75 0 001.06 0l7-7a.75.75 0 10-1.06-1.06l-6.47 6.47-2.47-2.47Z" />
            </svg>
          ) : (
            <svg width="16px" height="16px" viewBox="0 0 24 24" stroke="#000" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
            </svg>
          )}
        </button>

        <div className="flex flex-1 gap-6 items-center">
          <div className="max-2xl:size-4.5 size-6">
            <img src="/images/folder.png" alt="folder" className="w-full h-full" />
          </div>
          <div className="flex gap-3 items-center">
            <span className="text-sm 2xl:text-lg font-medium">Name</span>
            <ChevronIcon />
          </div>
        </div>

        <div className="flex flex-1 gap-3 items-center">
          <span className="text-sm 2xl:text-lg font-medium">Modified</span>
          <ChevronIcon />
        </div>

        <div className="flex flex-1 gap-3 items-center">
          <span className="text-sm 2xl:text-lg font-medium">File size</span>
          <ChevronIcon />
        </div>
      </div>

      {/* FILES ROWS */}
      <div className="flex flex-col gap-1 overflow-y-scroll no-scrollbar">
        {recentFiles.map((file, index) => (
          <div key={file.id} className="flex items-center gap-12 py-[clamp(1vh,1.5vh,2vh)] px-6 max-2xl:pl-8 bg-white rounded-md">
            <button onClick={() => toggleCheckbox(index)} className="active:scale-90 transition-all duration-300">
              {checkedState[index] ? (
                <svg width="16px" height="16px" viewBox="0 0 24 24" fill="#0956d3" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 1.25C6.06 1.25 1.25 6.06 1.25 12S6.06 22.75 12 22.75 22.75 17.94 22.75 12 17.94 1.25 12 1.25ZM7.53 11.97a.75.75 0 10-1.06 1.06l3 3a.75.75 0 001.06 0l7-7a.75.75 0 10-1.06-1.06l-6.47 6.47-2.47-2.47Z" />
                </svg>
              ) : (
                <svg width="16px" height="16px" viewBox="0 0 24 24" stroke="#000" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                </svg>
              )}
            </button>

            <div className="flex gap-4 justify-between items-center w-full">
              <div className="flex flex-1 gap-6 items-center">
                <div className="max-2xl:size-5 size-6">
                  <img src="/images/folder.png" alt="folder" className="w-full h-full" />
                </div>
                <span className="text-sm 2xl:text-lg font-medium">{file.name}</span>
              </div>

              <div className="flex flex-1 items-center">
                <span className="text-sm font-semibold text-[#74726f]">
                  {new Date(file.updated_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex flex-1 items-center">
                <span className="text-sm font-semibold text-[#74726f]">{file.size || "N/A"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentFiles;


