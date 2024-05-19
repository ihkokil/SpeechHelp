
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import WritingTipArticle from '@/components/help/WritingTipArticle';
import { articleContent, WritingArticle } from '@/components/help/articleContent';
import TipsHeader from '@/components/help/TipsHeader';
import TipsContent from '@/components/help/TipsContent';
import { allTipsSections } from '@/components/help/TipsData';

const WritingTips = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // State for the article dialog
  const [isArticleOpen, setIsArticleOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<WritingArticle | null>(null);
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const handleClose = () => {
    navigate('/dashboard');
  };

  // Function to open the full article
  const openArticle = (articleId: string) => {
    const article = articleContent.find(a => a.id === articleId);
    if (article) {
      setCurrentArticle(article);
      setIsArticleOpen(true);
    } else {
      toast({
        title: "Article not found",
        description: "The requested article could not be found.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <DashboardSidebar />
      
      <motion.div 
        className={`flex-1 relative bg-gray-50 ${isMobile ? "" : "ml-64"}`}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        <div className="h-full overflow-auto pb-16">
          <TipsHeader handleClose={handleClose} />
          <TipsContent tipsSections={allTipsSections} openArticle={openArticle} />
        </div>
        
        {/* Article Dialog */}
        <WritingTipArticle
          isOpen={isArticleOpen}
          onClose={() => setIsArticleOpen(false)}
          article={currentArticle}
        />
      </motion.div>
    </div>
  );
};

export default WritingTips;
