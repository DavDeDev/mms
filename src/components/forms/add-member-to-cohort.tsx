'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
// import { inviteMembersAction } from '@/app/actions/invite-members-action'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

const inviteFormSchema = z.object({
  email: z.string().email().optional(),
  role: z.enum(['mentor', 'mentee', 'admin']).optional(),
  excelFile: z.instanceof(File).optional(),
})

export function InviteMemberForm({ cohortId }: { cohortId: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof inviteFormSchema>>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: '',
      role: undefined,
      excelFile: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof inviteFormSchema>) {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('cohortId', cohortId)
    if (values.email) formData.append('email', values.email)
    if (values.role) formData.append('role', values.role)
    if (values.excelFile) formData.append('excelFile', values.excelFile)

    try {
      // const result = await inviteMembersAction(formData)
      if (result.success) {
        toast.success(result.message)
        form.reset()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('An error occurred while inviting members')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormDescription>
                Enter the email address of the person you want to invite.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="mentee">Mentee</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the role for the invited member.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="excelFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bulk Invite (Excel File)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormDescription>
                Upload an Excel file with columns for email and role.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Inviting...' : 'Invite Member(s)'}
        </Button>
      </form>
    </Form>
  )
}

