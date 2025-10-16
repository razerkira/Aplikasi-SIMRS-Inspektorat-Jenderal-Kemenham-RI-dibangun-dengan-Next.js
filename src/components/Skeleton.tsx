const Skeleton = ({ className = "" }: { className?: string }) => {
    return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />;
};

export default Skeleton;
