import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Star, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewCount: number;
  limit: number;
}

export const UpgradeModal = ({ open, onOpenChange, reviewCount, limit }: UpgradeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-amber-100 to-orange-100">
            <Crown className="h-8 w-8 text-amber-600" />
          </div>
          <DialogTitle className="text-xl font-bold">
            Ξεπεράσατε το όριο του δωρεάν πλάνου
          </DialogTitle>
          <DialogDescription className="text-base mt-3">
            Έχετε {reviewCount} από {limit} επιτρεπόμενα reviews. 
            Αναβαθμίστε στο Pro για απεριόριστα reviews και επιπλέον λειτουργίες!
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-3 flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Οφέλη του Pro Plan
            </h4>
            <ul className="space-y-2 text-sm text-amber-700">
              <li className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-green-600" />
                Απεριόριστα reviews
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-green-600" />
                Προηγμένα analytics
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-green-600" />
                Αυτόματες απαντήσεις
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-green-600" />
                Υποστήριξη προτεραιότητας
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2">
          <Link to="/settings" className="w-full">
            <Button 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
              onClick={() => onOpenChange(false)}
            >
              <Crown className="w-4 h-4 mr-2" />
              Αναβάθμιση στο Pro
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Ακύρωση
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};