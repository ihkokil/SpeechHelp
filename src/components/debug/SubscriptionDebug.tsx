import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { useSubscriptionSync } from '@/hooks/useSubscriptionSync';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Database, User, Clock } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

/**
 * Debug component to help troubleshoot subscription synchronization issues
 * Shows current subscription state and provides manual refresh controls
 */
export const SubscriptionDebug: React.FC = () => {
  const { user, profile, refreshUserData } = useAuth();
  const planLimits = usePlanLimits();
  const { syncSubscriptionData } = useSubscriptionSync();
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      console.log('🔄 Force refreshing subscription data from debug panel');
      // Force refresh both AuthContext and plan limits
      await syncSubscriptionData(true);
      // Also force refresh user data to clear any caches
      await refreshUserData(true);
    } catch (error) {
      console.error('Error during force refresh:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (isActive: boolean, isExpired: boolean) => {
    if (isExpired) return 'destructive';
    if (isActive) return 'default';
    return 'secondary';
  };

  const getStatusText = (isActive: boolean, isExpired: boolean) => {
    if (isExpired) return 'Expired';
    if (isActive) return 'Active';
    return 'Inactive';
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <CardTitle className="text-lg">Subscription Debug Panel</CardTitle>
              </div>
              <Badge variant={getStatusColor(planLimits.isActive, planLimits.isExpired)}>
                {getStatusText(planLimits.isActive, planLimits.isExpired)}
              </Badge>
            </div>
            <CardDescription>
              Current plan: {planLimits.planDisplayName} | 
              Effective plan: {planLimits.effectivePlan} |
              Days remaining: {planLimits.daysRemaining ?? 'Unlimited'}
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={handleRefresh} 
                disabled={isRefreshing}
                size="sm"
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Force Refresh
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Auth Context Data */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <h3 className="font-semibold">Auth Context Data</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div><strong>User ID:</strong> {user.id}</div>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Profile Loaded:</strong> {profile ? 'Yes' : 'No'}</div>
                  {profile && (
                    <>
                      <div><strong>Plan (Profile):</strong> {profile.subscription_plan || 'Not set'}</div>
                      <div><strong>Status (Profile):</strong> {profile.subscription_status || 'Not set'}</div>
                      <div><strong>Start Date:</strong> {formatDate(profile.subscription_start_date)}</div>
                      <div><strong>End Date:</strong> {formatDate(profile.subscription_end_date)}</div>
                      <div><strong>Profile Updated:</strong> {formatDate(profile.updated_at)}</div>
                    </>
                  )}
                </div>
              </div>

              {/* Plan Limits Data */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <h3 className="font-semibold">Plan Limits Data</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div><strong>Loading:</strong> {planLimits.loadingPlanLimits ? 'Yes' : 'No'}</div>
                  <div><strong>Current Plan:</strong> {planLimits.currentPlan}</div>
                  <div><strong>Effective Plan:</strong> {planLimits.effectivePlan}</div>
                  <div><strong>Is Active:</strong> {planLimits.isActive ? 'Yes' : 'No'}</div>
                  <div><strong>Is Expired:</strong> {planLimits.isExpired ? 'Yes' : 'No'}</div>
                  <div><strong>Should Show Upgrade:</strong> {planLimits.shouldShowUpgradePrompt ? 'Yes' : 'No'}</div>
                  <div><strong>Can Create Speech:</strong> {planLimits.canCreateSpeech ? 'Yes' : 'No'}</div>
                  {planLimits.reasonCannotCreate && (
                    <div><strong>Block Reason:</strong> {planLimits.reasonCannotCreate}</div>
                  )}
                  <div><strong>Speeches Used:</strong> {planLimits.speechesUsed}/{planLimits.speechesLimit === Infinity ? '∞' : planLimits.speechesLimit}</div>
                </div>
              </div>
            </div>

            {/* Cache Information */}
            <div className="space-y-3">
              <h3 className="font-semibold">Cache Information</h3>
              <div className="text-sm space-y-1">
                <div><strong>Plan Access Cache Keys:</strong></div>
                {Object.keys(localStorage)
                  .filter(key => key.startsWith('planAccess_'))
                  .map(key => (
                    <div key={key} className="ml-4 text-muted-foreground">• {key}</div>
                  ))
                }
                {Object.keys(localStorage).filter(key => key.startsWith('planAccess_')).length === 0 && (
                  <div className="ml-4 text-muted-foreground">No plan access cache found</div>
                )}
              </div>
            </div>

            {/* Troubleshooting Tips */}
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold">Troubleshooting Tips</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>If subscription updates aren't showing, click "Force Refresh"</li>
                <li>Check that both Profile and Plan Limits show the same subscription data</li>
                <li>Profile Updated timestamp should be recent if admin made changes</li>
                <li>Clear browser cache if problems persist</li>
                <li>Effective Plan may differ from Current Plan if subscription is expired</li>
              </ul>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};