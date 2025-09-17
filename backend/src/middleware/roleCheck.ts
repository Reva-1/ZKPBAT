import { Request, Response, NextFunction } from 'express';

export const roleCheck = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as any;
    if (!authReq.user) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }
    
    if (!allowedRoles.includes(authReq.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions'
      });
    }
    
    next();
  };
};
