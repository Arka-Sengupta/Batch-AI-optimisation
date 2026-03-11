import UploadJSON from "../components/UploadJSON";
import { Link } from "react-router-dom";

export default function Home(){

 return(
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">

    <div className="max-w-4xl mx-auto">
      
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Batch AI Optimization
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Transform your manufacturing process with AI-powered predictions and recommendations
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <UploadJSON/>
      </div>

    </div>

  </div>

 );

}
