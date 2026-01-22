
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import {Separator} from '@/components/ui/separator';
const AddCertificate = () => {
  const [expires, setExpires] = useState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Card className="border-slate-200 shadow-xl backdrop-blur-sm bg-white/80">
          <CardHeader className="space-y-1 pb-6 text-center sm:text-left">
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900 text-center">
              Issue New Certificate
            </CardTitle>
            <CardDescription className="text-base text-slate-600 text-center">
              Enter the details below to generate and issue a professional certificate.
            </CardDescription>
          </CardHeader>
            <Separator />
          <CardContent className="space-y-6">
            {/* Recipient */}
            <div className="space-y-2">
              <Label htmlFor="recipientName" className="text-slate-700 font-medium">
                Recipient's Full Name
              </Label>
              <Input
                id="recipientName"
                placeholder="e.g. Balaji Sudarshan Reddy"
                className="h-11 border-slate-300 focus-visible:ring-sky-500 focus-visible:border-sky-500 transition-shadow shadow-sm"
              />
            </div>

            {/* Issuer */}
            {/* <div className="space-y-2">
              <Label htmlFor="issuer" className="text-slate-700 font-medium">
                Issued By (Issuer)
              </Label>
              <Select>
                <SelectTrigger
                  id="issuer"
                  className="w-full h-11 border-slate-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm "
                >
                  <SelectValue placeholder="Select issuer / organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="issue1">Issuer 1</SelectItem>
                  <SelectItem value="issue2">Issuer 2</SelectItem>
                  <SelectItem value="issue3">Issuer 3</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            {/* Course */}
            <div className="space-y-2">
              <Label htmlFor="courseName" className="text-slate-700 font-medium">
                Course / Program Name
              </Label>
              <Input
                id="courseName"
                placeholder="Full stack`"
                className="h-11 border-slate-300 focus-visible:ring-sky-500 focus-visible:border-sky-500 shadow-sm"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-slate-700 font-medium flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-slate-500" />
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  className="h-11 border-slate-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-slate-700 font-medium flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-slate-500" />
                  End Date / Completion Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  className="h-11 border-slate-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                />
              </div>
            </div>

            {/* Expiry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-slate-700 font-medium flex items-center gap-2">
                  
                  Does the certificate expire?
                </Label>
                <Select onValueChange={setExpires} className="h-full">
                  <SelectTrigger
                    id="expires"
                    className="w-full h-full border-slate-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm "
                    >
                    <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="no">No, it does not expire</SelectItem>
                        <SelectItem value="yes">Yes, it expires</SelectItem>
                    </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-slate-700 font-medium flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-slate-500" />
                  End Date / Completion Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  className=" border-slate-300 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                  disabled={expires !== 'yes'}
                />
              </div>
            </div>

        
            {/* <div className="space-y-2 pt-2">
              <Label htmlFor="templateFile" className="text-slate-700 font-medium">
                Custom Template (PDF / Image)
              </Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-sky-400 transition-colors cursor-pointer">
                <p className="text-slate-500">Drag & drop or click to upload</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, PDF up to 5MB</p>
              </div>
            </div> */}
          </CardContent>

          <CardFooter className="flex justify-end pt-2 pb-6 px-6">
            <Button
              size="lg"
              className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white shadow-lg px-10"
            >
              Issue Certificate
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-slate-500 mt-6">
          Certificate will be generated with professional layout • Preview available after issuing
        </p>
      </div>
    </div>
  );
};

export default AddCertificate;