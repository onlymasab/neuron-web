"use client";

import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { FiUsers, FiUploadCloud, FiDollarSign, FiPieChart, FiSettings, FiBarChart2, FiTrendingUp } from 'react-icons/fi';
import { AppWindowIcon, CodeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { OrderTable} from '@/components/admin/order-table';
import CircularProgress from '@/components/ui/circular-progress';
import React from 'react';
import { useProfileStore } from '@/stores/useProfileStore';
import { toast } from 'sonner';
import { UserModel } from '@/types/UserModel';
import { YearChart } from '@/components/admin/year-chart';
import { TotalUserChart } from '@/components/admin/total-user-chart';
import { UserMonthChart } from '@/components/admin/user-month-chart';
import { UserStorageChart } from '@/components/admin/user-storage-chart';
import { TotalSaleChart } from '@/components/admin/total-sale-chart';



const Home = () => {
    const router = useRouter();
    
    const { user } = useAuthStore();
    const { users, loading, fetchUsers, reset } = useProfileStore();
    const [progress, setProgress] = React.useState([]);
    const [totalOrders, setTotalOrderProgress] = React.useState(0);
    const [paidOrders, setPaidOrderProgress] = React.useState(0);
    const [pendingOrders, setPendingOrderProgress] = React.useState(0);
    const [cancelOrders, setCancelOrderProgress] = React.useState(0);
    const [freeOrders, setfreeOrderProgress] = React.useState(0);
    const expectedOrders = users.length || 1; // Prevent division by 0
    const safePercent = (part: number) => expectedOrders ? (part / expectedOrders) * 100 : 0;

    useEffect(() => {
      fetchUsers();
    }, []);

    useEffect(() => {
      if (!users || users.length === 0) return;
      
      setTotalOrderProgress(users.length);
      setPaidOrderProgress(users.filter(user => user.payment_status === 'paid').length);
      setPendingOrderProgress(users.filter(user => user.payment_status === 'unpaid' && user.current_package !== 'free').length);
      setCancelOrderProgress(users.filter(user => user.payment_status === 'cancel').length);
      setfreeOrderProgress(users.filter(user => user.current_package === 'free').length);
    }, [users]);

   useEffect(() => {
    if (!user?.id) {
      router.push("/");
    }
  }, [user, router]);



  return (
    <div className="flex w-full  flex-col gap-6">

      
      
     
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="order">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">

          <div className='flex flex-col gap-4 w-full'>

           <div className='flex flex-row gap-4 w-full'>
              <div className="flex-1">
                <TotalUserChart data={users as UserModel[]} />
              </div>
              <div className="flex-1">
                <UserMonthChart data={users as UserModel[]} />
              </div>
              <div className="flex-1">
                <UserStorageChart data={users as UserModel[]} />
              </div>
              <div className="flex-1">
                <TotalSaleChart data={users as UserModel[]} />
              </div>
            </div>
            <YearChart  data = { users as UserModel[]}/>
          </div>
          
         
        </TabsContent>
        <TabsContent value="order">
          <Card>
            <CardHeader>
              <CardTitle>
                  <div className='flex flex-row gap-auto justify-between pr-8'>
                      <div className='flex flex-row gap-4'>
                          
                        <div className="max-w-xs mx-auto w-full flex flex-col items-center relative">
                          <CircularProgress value={safePercent(totalOrders)} size={120} strokeWidth={8} progressColor='#00B8D9' />
                          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black w-10 h-10" id="«r12»" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#00B8D9" d="M7.245 2h9.51c1.159 0 1.738 0 2.206.163a3.05 3.05 0 0 1 1.881 1.936C21 4.581 21 5.177 21 6.37v14.004c0 .858-.985 1.314-1.608.744a.946.946 0 0 0-1.284 0l-.483.442a1.657 1.657 0 0 1-2.25 0a1.657 1.657 0 0 0-2.25 0a1.657 1.657 0 0 1-2.25 0a1.657 1.657 0 0 0-2.25 0a1.657 1.657 0 0 1-2.25 0l-.483-.442a.946.946 0 0 0-1.284 0c-.623.57-1.608.114-1.608-.744V6.37c0-1.193 0-1.79.158-2.27c.3-.913.995-1.629 1.881-1.937C5.507 2 6.086 2 7.245 2" opacity="0.4"></path><path fill="#00B8D9" d="M7 6.75a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5zm3.5 0a.75.75 0 0 0 0 1.5H17a.75.75 0 0 0 0-1.5zM7 10.25a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5zm3.5 0a.75.75 0 0 0 0 1.5H17a.75.75 0 0 0 0-1.5zM7 13.75a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5zm3.5 0a.75.75 0 0 0 0 1.5H17a.75.75 0 0 0 0-1.5z"></path></svg>
                       </div>
                       <div className="flex flex-col gap-auto justify-between my-6">
                          <h4 className='text-[18px]'>Total</h4>
                          <p className="text-gray-400 w-24 text-[14px]">{users.length} orders</p>
                          <p className='text-[15px]'>
                            ${users.reduce((sum, user) => sum + (user.price ?? 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>

                      </div>

                      <div className='flex flex-row gap-4'>
                          
                        <div className="max-w-xs mx-auto w-full flex flex-col items-center relative">
                          <CircularProgress value={safePercent(paidOrders)} size={120} strokeWidth={8} progressColor='#22C55E' />
                          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black w-10 h-10" id="«r13»" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#22C55E" fillRule="evenodd" d="M14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14v-4c0-3.771 0-5.657 1.172-6.828S6.239 2 10.03 2c.606 0 1.091 0 1.5.017q-.02.12-.02.244l-.01 2.834c0 1.097 0 2.067.105 2.848c.114.847.375 1.694 1.067 2.386c.69.69 1.538.952 2.385 1.066c.781.105 1.751.105 2.848.105h4.052c.043.534.043 1.19.043 2.063V14c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22" clipRule="evenodd" opacity="0.4"></path><path fill="#22C55E" d="M10.56 15.498a.75.75 0 1 0-1.12-.996l-2.107 2.37l-.772-.87a.75.75 0 0 0-1.122.996l1.334 1.5a.75.75 0 0 0 1.12 0zm.95-13.238l-.01 2.835c0 1.097 0 2.066.105 2.848c.114.847.375 1.694 1.067 2.385c.69.691 1.538.953 2.385 1.067c.781.105 1.751.105 2.848.105h4.052q.02.232.028.5H22c0-.268 0-.402-.01-.56a5.3 5.3 0 0 0-.958-2.641c-.094-.128-.158-.204-.285-.357C19.954 7.494 18.91 6.312 18 5.5c-.81-.724-1.921-1.515-2.89-2.161c-.832-.556-1.248-.834-1.819-1.04a6 6 0 0 0-.506-.154c-.384-.095-.758-.128-1.285-.14z"></path></svg>
                       </div>
                       <div className="flex flex-col gap-auto justify-between my-6">
                          <h4 className='text-[18px]'>Paid</h4>
                          <p className="text-gray-400 w-24 text-[14px]">{users.filter(user => user.payment_status === 'paid').length} orders</p>
                          <p className='text-[15px]'>${ users.filter(user => user.payment_status === 'paid').reduce((sum, user) => sum + (user.price ?? 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>

                      </div>

                      <div className='flex flex-row gap-4'>
                          
                        <div className="max-w-xs mx-auto w-full flex flex-col items-center relative">
                          <CircularProgress value={safePercent(pendingOrders)} size={120} strokeWidth={8} progressColor='#FFAB00' />
                          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black w-10 h-10" id="«r14»" width="1em" height="1em" viewBox="0 0 24 24"><g fill="#FFAB00" fillRule="evenodd" clipRule="evenodd"><path d="M17 17a5 5 0 1 0 0-10a5 5 0 0 0 0 10m.75-7a.75.75 0 0 0-1.5 0v1.846c0 .18.065.355.183.491l1 1.154a.75.75 0 0 0 1.134-.982l-.817-.943z"></path><path d="M1.25 7A.75.75 0 0 1 2 6.25h8a.75.75 0 0 1 0 1.5H2A.75.75 0 0 1 1.25 7m0 5a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5H2a.75.75 0 0 1-.75-.75m0 5a.75.75 0 0 1 .75-.75h8a.75.75 0 0 1 0 1.5H2a.75.75 0 0 1-.75-.75" opacity="0.4"></path></g></svg>
                       </div>
                       <div className="flex flex-col gap-auto justify-between my-6">
                          <h4 className='text-[18px]'>Pending</h4>
                          <p className="text-gray-400 w-24 text-[14px]">{users.filter(user => user.payment_status === 'unpaid' && user.current_package !== 'free').length} orders</p>
                          <p className='text-[15px]'>${ users.filter(user => user.payment_status === 'unpaid').reduce((sum, user) => sum + (user.price ?? 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>

                      </div>

                      <div className='flex flex-row gap-4'>
                          
                        <div className="max-w-xs mx-auto w-full flex flex-col items-center relative">
                          <CircularProgress value={safePercent(cancelOrders)} size={120} strokeWidth={8} progressColor='#FF5630' />
                          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black w-10 h-10" id="«r15»" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#FF5630" d="M18.75 9v.704c0 .845.24 1.671.692 2.374l1.108 1.723c1.011 1.574.239 3.713-1.52 4.21a25.8 25.8 0 0 1-14.06 0c-1.759-.497-2.531-2.636-1.52-4.21l1.108-1.723a4.4 4.4 0 0 0 .693-2.374V9c0-3.866 3.022-7 6.749-7s6.75 3.134 6.75 7" opacity="0.4"></path><path fill="#FF5630" d="M12.75 6a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0zM7.243 18.545a5.002 5.002 0 0 0 9.513 0c-3.145.59-6.367.59-9.513 0"></path></svg>
                       </div>
                       <div className="flex flex-col gap-auto justify-between my-6">
                          <h4 className='text-[18px]'>Cancel</h4>
                          <p className="text-gray-400 w-24 text-[14px]">{users.filter(user => user.payment_status === 'cancel').length} orders</p>
                          <p className='text-[15px]'>${ users.filter(user => user.payment_status === 'cancel').reduce((sum, user) => sum + (user.price ?? 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>

                      </div>

                      <div className='flex flex-row gap-4'>
                          
                        <div className="max-w-xs mx-auto w-full flex flex-col items-center relative">
                          <CircularProgress value={safePercent(freeOrders)} size={120} strokeWidth={8} progressColor='#637381' />
                          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black w-10 h-10" id="«r16»" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#637381" d="m11.51 2.26l-.01 2.835c0 1.097 0 2.066.105 2.848c.114.847.375 1.694 1.067 2.385c.69.691 1.538.953 2.385 1.067c.781.105 1.751.105 2.848.105h4.052q.02.232.028.5H22c0-.268 0-.402-.01-.56a5.3 5.3 0 0 0-.958-2.641c-.094-.128-.158-.204-.285-.357C19.954 7.494 18.91 6.312 18 5.5c-.81-.724-1.921-1.515-2.89-2.161c-.832-.556-1.248-.834-1.819-1.04a6 6 0 0 0-.506-.154c-.384-.095-.758-.128-1.285-.14z"></path><path fill="#637381" d="M2 13.662V9.775C2 6.11 2 4.277 3.172 3.139C4.343 2 6.239 2 10.03 2c.591 0 1.068 0 1.47.015l.01.244l-.01 2.749v.18c0 1.059.003 1.995.105 2.755c.114.847.375 1.694 1.067 2.385c.69.691 1.538.953 2.385 1.067c.781.105 1.751.105 2.848.105h4.052q.02.232.028.5h.008c.007.357.007.765.007 1.238v1.106l-.012.006a5 5 0 0 0-.267.146a3.17 3.17 0 0 1-3.43 0a2.38 2.38 0 0 0-2.572 0a3.17 3.17 0 0 1-3.43 0a2.38 2.38 0 0 0-2.572 0a3.17 3.17 0 0 1-3.43 0a2.38 2.38 0 0 0-2.572 0c-.138.088-.206.133-.256.158c-.386.194-1.017.027-1.459-.29z" opacity="0.4"></path><path fill="#637381" d="M10 22h4c3.771 0 5.657 0 6.829-.933c1.096-.874 1.166-2.246 1.171-4.881l-.012.005a5 5 0 0 0-.267.12c-1.039.55-2.392.55-3.43 0a2.82 2.82 0 0 0-2.572 0c-1.039.55-2.392.55-3.43 0a2.82 2.82 0 0 0-2.573 0c-1.038.55-2.39.55-3.43 0a2.82 2.82 0 0 0-2.572 0a4 4 0 0 1-.255.129c-.386.159-1.017.022-1.459-.238c.005 2.625.077 3.993 1.171 4.865C4.343 22 6.23 22 10 22"></path></svg>
                       </div>
                       <div className="flex flex-col gap-auto justify-between my-6">
                          <h4 className='text-[18px]'>Free</h4>
                          <p className="text-gray-400 w-24 text-[14px]">{users.filter(user => user.current_package === 'free').length} orders</p>
                          <p className='text-[15px]'>${ users.filter(user => user.current_package === 'free').reduce((sum, user) => sum + (user.price ?? 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>

                      </div>
                       
                  </div>
              </CardTitle>
              <CardDescription>
                <hr />
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <OrderTable data={users as UserModel[]} />
            </CardContent>
            <CardFooter>
              <hr />
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;











