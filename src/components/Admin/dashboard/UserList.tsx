import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import Table from "../../Common/Table";
import { getUsers, toggleBlockUser } from "../../../api/admin";



interface IUser{
  _id:string;
  firstName:string;
  lastName:string;
  email: string;
  password: string;
  isBlocked: boolean;
  purchasedCourses: string[];
  cart:string[]; 
  wishlist:string[]; 
  profilePicture:string;
}


function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<IUser[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  const [confirmTemplateVisible, setConfirmTemplateVisible] = useState(false)
  const [name, setName] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [isBlocking, setIsBlocking] = useState<boolean>(false)


  useEffect(() => {
      // setIsLoading(true)
      const fetchUsers = async () => {
        try {
          const users = await getUsers()
          setUsers(users); // Access the 'courses' property from the response
        } catch (error) {
          console.error("Error fetching course data:", error);
        }finally{
          // setIsLoading(false)
        }
      };
  
      fetchUsers();
    }, []);

    const handleToggleBlock = async (userId:string) => {
      setIsBlocking(true)
      const response = await toggleBlockUser(userId);
        if(response.success){
          setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId
              ? { ...user, isBlocked: !user.isBlocked }
              : user
            )
          );
        }
        setConfirmTemplateVisible(false)
        setIsBlocking(false)
  }

  const confirmBlock = (userId:string, name:string, isBlocked:boolean)=> {
    setUserId(userId)
    setName(name)
    setIsBlocked(isBlocked)
    setConfirmTemplateVisible(true);
  }

  const cancelBlock = ()=>{
    setUserId('')
    setName(null);
    setIsBlocked(null);
    setConfirmTemplateVisible(false)
  }

  // handleToggleBlock(row._id)
  const columns = [
    {
      header: '',
      type: 'image',
      key: 'profilePicture',
    },
    {
      header: 'Username',
      type: 'text',
      key: 'username',
    },
    {
      header: 'Email',
      type:'text',
      key: 'email',
    },
    // {
    //   header: 'Enrolled Courses',
    //   type: 'text',
    //   key: 'enrolledCoruses',
    //   render: (row:any)=> `${row.purchasedCourses.length}`
    // },
    {
      header: 'Action',
      type: 'button',
      key:'action',
      render: (row:any)=> (
        <>
          <button className="bg-primary text-white rounded-lg px-3 md:px-6 m-1 md:m-2 py-1  cursor-pointer" onClick={()=> navigate('/')}>
            Details
          </button>
          <button
            className={`${
              row.isBlocked
                ? "bg-green-500 md:px-4"
                : "bg-red-600  md:px-6"
            } rounded-lg px-3  m-1 md:m-2 py-1 text-white cursor-pointer`}
            onClick={() => confirmBlock(row._id,row.email,row.isBlocked)}
          >
            {row.isBlocked ? "Unblock" : "Block"}
          </button>
        </>
      )
    }
  ]
   return (<>
            <div className={`fixed inset-0 flex justify-center  min-h-screen items-center z-50 transition-opacity duration-300 ${confirmTemplateVisible ? "bg-black bg-opacity-50" : "opacity-0 hidden"}`}
                >

                    <motion.div
                        initial={{ opacity: 0, y: -150 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="bg-white p-5 rounded-lg shadow-lg z-50 md:mt-48 ">
                        <div className="flex flex-col items-center justify-center gap-7">
                          <div className=" mx-7">
                            <h1 className="text-primary text-center mx-2">{`Are you sure you want to ${isBlocked? "unblock" : "block"} user with email id `}</h1>
                            <h1 className="font-semibold text-primary text-center mx-2">{name}</h1>
                          </div> 

                            <div className=" flex justify-between gap-5">
                              {isBlocking ? <>Loadin...</> : (
                                <>
                                  <button className="bg-primary px-3 py-1 rounded-lg text-accent cursor-pointer text-text-primary" onClick={()=> handleToggleBlock(userId)} >
                                    Confirm
                                  </button>
                                  <button className="bg-lavender px-3 py-1 rounded-lg cursor-pointer bg-secondary text-text-secondary" onClick={cancelBlock}>
                                    Cancel
                                  </button>

                                </>
                              )}

                            </div>
                        </div>
                    </motion.div>


            </div>
            <Table columns={columns} data={users} title={'Users'}/>
          </>)
}

export default Users