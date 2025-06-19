
import React, { useState } from 'react';
import { MessageCircle, Users, Clock, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const ChatPage: React.FC = () => {
  const [contacts] = useState([
    { id: 1, name: 'John Doe', lastMessage: 'Hey, how are you?', time: '2:30 PM', online: true },
    { id: 2, name: 'Jane Smith', lastMessage: 'See you tomorrow!', time: '1:15 PM', online: false },
    { id: 3, name: 'Mike Johnson', lastMessage: 'Thanks for the help', time: '12:45 PM', online: true },
  ]);

  const [groups] = useState([
    { id: 1, name: 'Family Group', lastMessage: 'Alice: Dinner at 7?', time: '3:00 PM', members: 5 },
    { id: 2, name: 'Work Team', lastMessage: 'Bob: Meeting tomorrow', time: '2:20 PM', members: 8 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <MessageCircle className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Secure Chat</h1>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <Input placeholder="Search contacts or messages..." className="w-full" />
        </CardContent>
      </Card>

      {/* Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Contacts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {contact.name.charAt(0)}
                    </div>
                    {contact.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.lastMessage}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">{contact.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Group Chats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Group Chats</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {groups.map((group) => (
              <div key={group.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                    {group.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{group.name}</p>
                    <p className="text-sm text-muted-foreground">{group.lastMessage}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{group.time}</p>
                  <p className="text-xs text-muted-foreground">{group.members} members</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Features */}
      <Card>
        <CardHeader>
          <CardTitle>Security Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
              <Lock className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">End-to-End Encryption</p>
                <p className="text-sm text-muted-foreground">All messages are encrypted</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Message History</p>
                <p className="text-sm text-muted-foreground">Secure chat history</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
